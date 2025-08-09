import { Injectable } from '@nestjs/common';
import type { CommandBus } from '@nestjs/cqrs';
import { plainToClass } from 'class-transformer';
import { desc, eq, or, sql } from 'drizzle-orm';

import { PageDto } from '../../common/dto/page.dto.ts';
import { PageMetaDto } from '../../common/dto/page-meta.dto.ts';
import { generateHash } from '../../common/utils.ts';
import type { RoleType } from '../../constants/role-type.ts';
import type { DrizzleService } from '../../database/drizzle.service.ts';
import { users } from '../../database/schema/user.ts';

type DbUser = typeof users.$inferSelect;
import { FileNotImageException } from '../../exceptions/file-not-image.exception.ts';
import { UserNotFoundException } from '../../exceptions/user-not-found.exception.ts';
import type { IFile } from '../../interfaces/IFile.ts';
import type { AwsS3Service } from '../../shared/services/aws-s3.service.ts';
import type { ValidatorService } from '../../shared/services/validator.service.ts';
import type { Reference, Uuid } from '../../types.ts';
import type { UserRegisterDto } from '../auth/dto/user-register.dto.ts';
import { CreateSettingsCommand } from './commands/create-settings.command.ts';
import { CreateSettingsDto } from './dtos/create-settings.dto.ts';
import { UserDto } from './dtos/user.dto.ts';
import type { UsersPageOptionsDto } from './dtos/users-page-options.dto.ts';
import type { User } from './types/user.type.ts';
import type { UserSettings } from './types/user-settings.type.ts';

@Injectable()
export class UserService {
  constructor(
    private drizzleService: DrizzleService,
    private validatorService: ValidatorService,
    private awsS3Service: AwsS3Service,
    private commandBus: CommandBus,
  ) {}

  /**
   * Convert Drizzle query result to User type
   */
  private toUserType(dbUser: DbUser): User {
    return {
      id: String(dbUser.id),
      createdAt: new Date(dbUser.createdAt),
      updatedAt: new Date(dbUser.updatedAt),
      firstName: dbUser.firstName,
      lastName: dbUser.lastName,
      role: dbUser.role as RoleType,
      email: dbUser.email,
      password: dbUser.password,
      phone: dbUser.phone,
      avatar: dbUser.avatar,
    };
  }

  /**
   * Find single user
   */
  async findOne(findData: Partial<User>): Promise<User | null> {
    if (findData.id) {
      const result = await this.drizzleService.database.select().from(users).where(eq(users.id, findData.id)).limit(1);

      return result[0] ? this.toUserType(result[0]) : null;
    }

    if (findData.email) {
      const result = await this.drizzleService.database
        .select()
        .from(users)
        .where(eq(users.email, findData.email))
        .limit(1);

      return result[0] ? this.toUserType(result[0]) : null;
    }

    return null;
  }

  async findByUsernameOrEmail(options: Partial<{ username: string; email: string }>): Promise<User | null> {
    const conditions = [];

    if (options.email) {
      conditions.push(eq(users.email, options.email));
    }

    if (options.username) {
      conditions.push(eq(users.email, options.username)); // Assuming username is stored in email field
    }

    if (conditions.length === 0) {
      return null;
    }

    const result = await this.drizzleService.database
      .select()
      .from(users)
      .where(or(...conditions))
      .limit(1);

    return result[0] ? this.toUserType(result[0]) : null;
  }

  async createUser(userRegisterDto: UserRegisterDto, file?: Reference<IFile>): Promise<User> {
    if (file && !this.validatorService.isImage(file.mimetype)) {
      throw new FileNotImageException();
    }

    let avatarUrl: string | null = null;

    if (file) {
      avatarUrl = await this.awsS3Service.uploadImage(file);
    }

    const [user] = await this.drizzleService.database
      .insert(users)
      .values({
        firstName: userRegisterDto.firstName,
        lastName: userRegisterDto.lastName,
        email: userRegisterDto.email,
        phone: userRegisterDto.phone,
        password: generateHash(userRegisterDto.password),
        avatar: avatarUrl,
      })
      .returning();

    if (!user) {
      throw new Error('Failed to create user');
    }

    await this.createSettings(
      user.id as Uuid,
      plainToClass(CreateSettingsDto, {
        isEmailVerified: false,
        isPhoneVerified: false,
      }),
    );

    return this.toUserType(user);
  }

  async getUsers(pageOptionsDto: UsersPageOptionsDto): Promise<PageDto<UserDto>> {
    const { page, take } = pageOptionsDto;
    const offset = (page - 1) * take;

    const [items, totalCount] = await Promise.all([
      this.drizzleService.database.select().from(users).orderBy(desc(users.createdAt)).limit(take).offset(offset),
      this.drizzleService.database
        .select({ count: sql`count(*)` })
        .from(users)
        .then((result) => Number(result[0]?.count ?? 0)),
    ]);

    const pageMetaDto = new PageMetaDto({
      pageOptionsDto,
      itemCount: totalCount,
    });

    const userDtos = items.map((user) => new UserDto(this.toUserType(user)));

    return new PageDto(userDtos, pageMetaDto);
  }

  async getUser(userId: Uuid): Promise<UserDto> {
    const [user] = await this.drizzleService.database.select().from(users).where(eq(users.id, userId)).limit(1);

    if (!user) {
      throw new UserNotFoundException();
    }

    return new UserDto(this.toUserType(user));
  }

  createSettings(userId: Uuid, createSettingsDto: CreateSettingsDto): Promise<UserSettings> {
    return this.commandBus.execute<CreateSettingsCommand, UserSettings>(
      new CreateSettingsCommand(userId, createSettingsDto),
    );
  }
}
