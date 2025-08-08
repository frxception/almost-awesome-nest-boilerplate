# Code Style and Patterns Guide

This document serves as a comprehensive guide for code style, patterns, and conventions used in the Almost Awesome NestJS Boilerplate. Use this as a reference for maintaining consistency across the codebase and for future code generation.

- [Code Style and Patterns Guide](#code-style-and-patterns-guide)
  - [General Code Style](#general-code-style)
    - [Code Formatting](#code-formatting)
    - [Import Organization](#import-organization)
    - [TypeScript Conventions](#typescript-conventions)
  - [File and Directory Structure](#file-and-directory-structure)
    - [Module Structure](#module-structure)
    - [File Naming Conventions](#file-naming-conventions)
  - [Controllers](#controllers)
    - [Controller Structure](#controller-structure)
    - [Controller Best Practices](#controller-best-practices)
  - [Services](#services)
    - [Service Structure](#service-structure)
    - [Service Best Practices](#service-best-practices)
  - [DTOs (Data Transfer Objects)](#dtos-data-transfer-objects)
    - [Input DTOs](#input-dtos)
    - [Response DTOs](#response-dtos)
    - [DTO Best Practices](#dto-best-practices)
  - [DTO Validation](#dto-validation)
    - [Field Decorators](#field-decorators)
    - [Custom Validation Options](#custom-validation-options)
  - [Entities](#entities)
    - [Entity Structure](#entity-structure)
    - [Relationship Patterns](#relationship-patterns)
    - [Entity Best Practices](#entity-best-practices)
  - [CQRS Pattern](#cqrs-pattern)
    - [Command Structure](#command-structure)
    - [Query Structure](#query-structure)
    - [CQRS Best Practices](#cqrs-best-practices)
  - [Exception Handling](#exception-handling)
    - [Custom Exception Structure](#custom-exception-structure)
    - [Exception Best Practices](#exception-best-practices)
  - [Authentication and Authorization](#authentication-and-authorization)
    - [Auth Decorator Usage](#auth-decorator-usage)
    - [Parameter Validation](#parameter-validation)
  - [API Documentation](#api-documentation)
    - [Swagger Documentation Patterns](#swagger-documentation-patterns)
  - [Testing Patterns](#testing-patterns)
    - [Unit Test Structure](#unit-test-structure)
    - [E2E Test Structure](#e2e-test-structure)
  - [Best Practices](#best-practices)
    - [Code Organization](#code-organization)
    - [Performance](#performance)
    - [Security](#security)
    - [Maintainability](#maintainability)
    - [Type Safety](#type-safety)

## General Code Style

### Code Formatting

```typescript
// Use single quotes for strings
const message = 'Hello World';

// Use trailing commas
const config = {
  database: 'postgresql',
  port: 5432,
};

// Use 2 spaces for indentation
if (condition) {
  doSomething();
}

// Use semicolons
const value = getValue();

// Use template literals for string interpolation
const url = `https://api.example.com/users/${userId}`;
```

### Import Organization

```typescript
// 1. Node modules imports
import { Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';

// 2. Internal imports (absolute paths with .ts extension)
import { validateHash } from '../../common/utils.ts';
import type { RoleType } from '../../constants/role-type.ts';
import { UserNotFoundException } from '../../exceptions/user-not-found.exception.ts';

// 3. Relative imports
import type { UserEntity } from '../user/user.entity.ts';
import { UserService } from '../user/user.service.ts';
```

### TypeScript Conventions

```typescript
// Use type imports when only importing types
import type { RoleType } from '../constants/role-type.ts';
import type { Reference } from '../types.ts';

// Use readonly for DTO properties
export class UserLoginDto {
  @EmailField()
  readonly email!: string;

  @StringField()
  readonly password!: string;
}

// Use definite assignment assertion for decorated properties
@Column({ unique: true })
email!: string;

// Use optional properties appropriately
phone?: string;
```

## File and Directory Structure

### Module Structure

```
modules/feature-name/
├── commands/           # CQRS command handlers
│   └── create-feature/
├── queries/           # CQRS query handlers
│   └── get-feature/
├── dto/              # Data Transfer Objects
├── exceptions/       # Module-specific exceptions
├── feature.controller.ts
├── feature.service.ts
├── feature.module.ts
├── feature.entity.ts
└── feature-related.entity.ts
```

### File Naming Conventions

- Use kebab-case for file names: `user-login.dto.ts`
- Use descriptive names: `create-user.command.ts`
- Include the type in the filename: `.controller.ts`, `.service.ts`, `.dto.ts`, `.entity.ts`
- Use singular names for entities: `user.entity.ts` not `users.entity.ts`

## Controllers

### Controller Structure

```typescript
import {
  Body,
  Controller,
  Get,
  HttpCode,
  HttpStatus,
  Post,
  Query,
  ValidationPipe,
} from '@nestjs/common';
import { ApiOkResponse, ApiTags } from '@nestjs/swagger';

import { RoleType } from '../../constants/role-type.ts';
import { AuthUser } from '../../decorators/auth-user.decorator.ts';
import { Auth, UUIDParam } from '../../decorators/http.decorators.ts';
import { UserDto } from './dtos/user.dto.ts';
import { UserEntity } from './user.entity.ts';
import { UserService } from './user.service.ts';

@Controller('users')
@ApiTags('users')
export class UserController {
  constructor(
    private userService: UserService,
    // Inject other services as needed
  ) {}

  @Post()
  @HttpCode(HttpStatus.CREATED)
  @Auth([RoleType.ADMIN])
  @ApiOkResponse({ type: UserDto, description: 'User created successfully' })
  async createUser(
    @Body() createUserDto: CreateUserDto,
  ): Promise<UserDto> {
    return this.userService.createUser(createUserDto);
  }

  @Get(':id')
  @HttpCode(HttpStatus.OK)
  @Auth([RoleType.USER])
  @ApiOkResponse({ type: UserDto, description: 'Get user by ID' })
  async getUser(@UUIDParam('id') userId: Uuid): Promise<UserDto> {
    return this.userService.getUser(userId);
  }

  @Get()
  @HttpCode(HttpStatus.OK)
  @Auth([RoleType.USER])
  @ApiPageResponse({
    description: 'Get paginated users list',
    type: PageDto
  })
  async getUsers(
    @Query(new ValidationPipe({ transform: true }))
    pageOptionsDto: UsersPageOptionsDto,
  ): Promise<PageDto<UserDto>> {
    return this.userService.getUsers(pageOptionsDto);
  }
}
```

### Controller Best Practices

1. **Use dependency injection via constructor**
2. **Mark injected services as `private`**
3. **Use specific HTTP status codes with `@HttpCode()`**
4. **Apply authentication/authorization with `@Auth()` decorator**
5. **Use proper Swagger documentation**
6. **Use ValidationPipe for query parameters**
7. **Use custom decorators like `@UUIDParam()` for parameter validation**
8. **Keep controllers thin - delegate business logic to services**

## Services

### Service Structure

```typescript
import { Injectable } from '@nestjs/common';
import { DrizzleService } from '../../database/drizzle.service';

import { PageDto } from '../../common/dto/page.dto.ts';
import { PageMetaDto } from '../../common/dto/page-meta.dto.ts';
import { UserNotFoundException } from '../../exceptions/user-not-found.exception.ts';
import type { IFile } from '../../interfaces/IFile.ts';
import type { Reference } from '../../types.ts';
import { CreateUserDto } from './dtos/create-user.dto.ts';
import { UserDto } from './dtos/user.dto.ts';
import { UsersPageOptionsDto } from './dtos/users-page-options.dto.ts';
import { User } from './types/user.type.ts';

@Injectable()
export class UserService {
  constructor(
    private drizzleService: DrizzleService,
    // Inject other services as needed
  ) {}

  async createUser(
    createUserDto: CreateUserDto,
    file?: Reference<IFile>,
  ): Promise<User> {
    const userData = {
      ...createUserDto,
      avatar: file?.key || null,
    };

    const [user] = await this.drizzleService.database
      .insert(users)
      .values(userData)
      .returning();

    return user;
  }

  async findOne(findOptions: Partial<User>): Promise<User> {
    const user = await this.drizzleService.database
      .select()
      .from(users)
      .where(eq(users.email, findOptions.email!))
      .limit(1);

    if (!user[0]) {
      throw new UserNotFoundException();
    }

    return user[0];
  }

  async getUser(userId: Uuid): Promise<UserDto> {
    const user = await this.findOne({ id: userId });

    return new UserDto(user);
  }

  async getUsers(
    pageOptionsDto: UsersPageOptionsDto,
  ): Promise<PageDto<UserDto>> {
    const { take, skip } = pageOptionsDto;
    
    const [items, total] = await Promise.all([
      this.drizzleService.database
        .select()
        .from(users)
        .limit(take)
        .offset(skip),
      this.drizzleService.database
        .select({ count: sql<number>`count(*)` })
        .from(users),
    ]);

    const pageMetaDto = new PageMetaDto({ itemCount: total[0].count, pageOptionsDto });
    const userDtos = items.map(item => new UserDto(item));

    return userDtos.toPageDto(pageMetaDto);
  }
}
```

### Service Best Practices

1. **Use `@Injectable()` decorator**
2. **Inject DrizzleService for database operations**
3. **Mark dependencies as `private`**
4. **Create separate methods for finding entities vs returning DTOs**
5. **Throw custom exceptions for not found cases**
6. **Use Drizzle ORM query builders for complex queries**
7. **Return DTOs from public methods, types from private/internal methods**
8. **Use pagination for list endpoints**

## DTOs (Data Transfer Objects)

### Input DTOs

```typescript
import {
  EmailField,
  PasswordField,
  PhoneFieldOptional,
  StringField,
} from '../../../decorators/field.decorators.ts';

export class CreateUserDto {
  @StringField()
  readonly firstName!: string;

  @StringField()
  readonly lastName!: string;

  @EmailField()
  readonly email!: string;

  @PasswordField({ minLength: 6 })
  readonly password!: string;

  @PhoneFieldOptional()
  readonly phone?: string;
}
```

### Response DTOs

```typescript
import { AbstractDto } from '../../../common/dto/abstract.dto.ts';
import { RoleType } from '../../../constants/role-type.ts';
import {
  BooleanFieldOptional,
  EmailFieldOptional,
  EnumFieldOptional,
  PhoneFieldOptional,
  StringFieldOptional,
} from '../../../decorators/field.decorators.ts';
import type { UserEntity } from '../user.entity.ts';

export type UserDtoOptions = Partial<{ isActive: boolean }>;

export class UserDto extends AbstractDto {
  @StringFieldOptional({ nullable: true })
  firstName?: string | null;

  @StringFieldOptional({ nullable: true })
  lastName?: string | null;

  @EnumFieldOptional(() => RoleType)
  role?: RoleType;

  @EmailFieldOptional({ nullable: true })
  email?: string | null;

  @PhoneFieldOptional({ nullable: true })
  phone?: string | null;

  @BooleanFieldOptional()
  isActive?: boolean;

  constructor(user: UserEntity, options?: UserDtoOptions) {
    super(user);
    this.firstName = user.firstName;
    this.lastName = user.lastName;
    this.role = user.role;
    this.email = user.email;
    this.phone = user.phone;
    this.isActive = options?.isActive;
  }
}
```

### DTO Best Practices

1. **Use `readonly` for all input DTO properties**
2. **Extend `AbstractDto` for response DTOs**
3. **Use custom field decorators for validation and Swagger documentation**
4. **Use optional fields with proper typing (`?` and `| null`)**
5. **Implement constructor for response DTOs that maps from entities**
6. **Use options type for additional DTO construction parameters**
7. **Use definite assignment assertion (`!`) for required fields**

## DTO Validation

### Field Decorators

```typescript
// String fields
@StringField()                           // Required string, min length 1
@StringFieldOptional()                   // Optional string

@StringField({ minLength: 3, maxLength: 50 })  // With length constraints
@StringField({ toLowerCase: true })             // Transform to lowercase
@StringField({ nullable: true })               // Allow null values

// Email fields
@EmailField()                           // Required email validation
@EmailFieldOptional()                   // Optional email

// Password fields
@PasswordField()                        // Required password, min length 6
@PasswordField({ minLength: 8 })        // Custom min length
@PasswordFieldOptional()                // Optional password

// Number fields
@NumberField()                          // Required number
@NumberField({ min: 0, max: 100 })      // With range constraints
@NumberField({ int: true })             // Integer only
@NumberField({ isPositive: true })       // Positive numbers only
@NumberFieldOptional()                  // Optional number

// Boolean fields
@BooleanField()                         // Required boolean
@BooleanFieldOptional()                 // Optional boolean

// Enum fields
@EnumField(() => RoleType)              // Required enum
@EnumFieldOptional(() => RoleType)      // Optional enum

// UUID fields
@UUIDField()                           // Required UUID
@UUIDFieldOptional()                   // Optional UUID

// Date fields
@DateField()                           // Required date
@DateFieldOptional()                   // Optional date

// URL fields
@URLField()                            // Required URL validation
@URLFieldOptional()                    // Optional URL

// Phone fields
@PhoneField()                          // Required phone validation
@PhoneFieldOptional()                  // Optional phone

// Nested object validation
@ClassField(() => AddressDto)          // Required nested object
@ClassFieldOptional(() => AddressDto)  // Optional nested object
```

### Custom Validation Options

```typescript
// Array validation
@StringField({ each: true })           // Array of strings
@NumberField({ each: true, min: 0 })   // Array of positive numbers

// Swagger documentation control
@StringField({ swagger: false })       // Exclude from Swagger docs

// Validation groups
@StringField({ groups: ['create'] })   // Only validate in 'create' group
```

## Database Schema

### Schema Structure

```typescript
import { pgTable, varchar, pgEnum, uuid, timestamp } from 'drizzle-orm/pg-core';

import { baseTable } from '../../database/schema/base';
import { RoleType } from '../../constants/role-type';

// Define enums
export const roleEnum = pgEnum('users_role_enum', ['USER', 'ADMIN']);

// Define tables
export const users = pgTable('users', {
  ...baseTable,
  firstName: varchar('first_name'),
  lastName: varchar('last_name'),
  role: roleEnum('role').default('USER').notNull(),
  email: varchar('email').unique(),
  password: varchar('password'),
  phone: varchar('phone'),
  avatar: varchar('avatar'),
});

// Define relations
export const usersRelations = relations(users, ({ one, many }) => ({
  settings: one(userSettings, {
    fields: [users.id],
    references: [userSettings.userId],
  }),
  posts: many(posts),
}));

// TypeScript types
export type User = typeof users.$inferSelect;
export type NewUser = typeof users.$inferInsert;
```

### Relationship Patterns

```typescript
// One-to-One
export const usersRelations = relations(users, ({ one }) => ({
  settings: one(userSettings, {
    fields: [users.id],
    references: [userSettings.userId],
  }),
}));

// One-to-Many
export const usersRelations = relations(users, ({ many }) => ({
  posts: many(posts),
}));

// Many-to-One
export const postsRelations = relations(posts, ({ one }) => ({
  user: one(users, {
    fields: [posts.userId],
    references: [users.id],
  }),
}));

// Foreign key column
export const posts = pgTable('posts', {
  ...baseTable,
  userId: uuid('user_id').notNull(),
});
```

### Schema Best Practices

1. **Use `baseTable` for common fields (id, createdAt, updatedAt)**
2. **Define TypeScript types for type safety**
3. **Use explicit table names with `pgTable('table_name')`**
4. **Specify column types explicitly**
5. **Use nullable columns appropriately**
6. **Add unique constraints where needed**
7. **Define relations separately for better organization**
8. **Use TypeScript types for relationship properties**
9. **Use `.notNull()` for required fields**
10. **Use computed columns for derived fields**

## CQRS Pattern

### Command Structure

```typescript
import type { ICommand, ICommandHandler } from '@nestjs/cqrs';
import { CommandHandler } from '@nestjs/cqrs';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

import type { CreateUserDto } from '../dtos/create-user.dto.ts';
import { User } from '../types/user.type.ts';

export class CreateUserCommand implements ICommand {
  constructor(
    public readonly createUserDto: CreateUserDto,
    public readonly avatarFile?: IFile,
  ) {}
}

@CommandHandler(CreateUserCommand)
export class CreateUserHandler
  implements ICommandHandler<CreateUserCommand, User>
{
  constructor(
    private drizzleService: DrizzleService,
  ) {}

  async execute(command: CreateUserCommand): Promise<User> {
    const { createUserDto, avatarFile } = command;

    const userData = {
      ...createUserDto,
      avatar: avatarFile?.key || null,
    };

    const [user] = await this.drizzleService.database
      .insert(users)
      .values(userData)
      .returning();

    return user;
  }
}
```

### Query Structure

```typescript
import type { IQuery, IQueryHandler } from '@nestjs/cqrs';
import { QueryHandler } from '@nestjs/cqrs';

import { UserNotFoundException } from '../../../exceptions/user-not-found.exception.ts';
import { User } from '../types/user.type.ts';

export class GetUserQuery implements IQuery {
  constructor(public readonly userId: Uuid) {}
}

@QueryHandler(GetUserQuery)
export class GetUserHandler implements IQueryHandler<GetUserQuery, User> {
  constructor(
    private drizzleService: DrizzleService,
  ) {}

  async execute(query: GetUserQuery): Promise<User> {
    const { userId } = query;

    const [user] = await this.drizzleService.database
      .select()
      .from(users)
      .where(eq(users.id, userId))
      .limit(1);

    if (!user) {
      throw new UserNotFoundException();
    }

    return user;
  }
}
```

### CQRS Best Practices

1. **Separate commands (writes) from queries (reads)**
2. **Commands should return types for further processing**
3. **Queries should return types that will be converted to DTOs**
4. **Use descriptive command and query names**
5. **Include all necessary data in command/query constructors**
6. **Handle errors with custom exceptions**
7. **Use dependency injection for DrizzleService and other services**

## Exception Handling

### Custom Exception Structure

```typescript
import { NotFoundException } from '@nestjs/common';

export class UserNotFoundException extends NotFoundException {
  constructor(error?: string) {
    super('error.userNotFound', error);
  }
}

import { BadRequestException } from '@nestjs/common';

export class InvalidPasswordException extends BadRequestException {
  constructor() {
    super('error.invalidPassword');
  }
}

import { ConflictException } from '@nestjs/common';

export class UserAlreadyExistsException extends ConflictException {
  constructor() {
    super('error.userAlreadyExists');
  }
}
```

### Exception Best Practices

1. **Extend appropriate NestJS exception classes**
2. **Use i18n keys for error messages**
3. **Follow naming convention: `EntityActionException`**
4. **Keep error messages generic for security**
5. **Use specific HTTP status codes**

## Authentication and Authorization

### Auth Decorator Usage

```typescript
// No authentication required
@Get('public-endpoint')
async getPublicData() {
  return this.service.getPublicData();
}

// Authentication required, no role restriction
@Get('protected')
@Auth()
async getProtectedData(@AuthUser() user: UserEntity) {
  return this.service.getProtectedData(user);
}

// Specific role required
@Post('admin-only')
@Auth([RoleType.ADMIN])
async adminAction(@AuthUser() user: UserEntity) {
  return this.service.performAdminAction(user);
}

// Multiple roles allowed
@Get('user-or-admin')
@Auth([RoleType.USER, RoleType.ADMIN])
async getUserOrAdminData(@AuthUser() user: UserEntity) {
  return this.service.getData(user);
}

// Public route (explicitly marked)
@Get('sometimes-public')
@Auth([], { public: true })
async getDataWithOptionalAuth(@AuthUser() user?: UserEntity) {
  return this.service.getDataWithOptionalAuth(user);
}
```

### Parameter Validation

```typescript
// UUID parameter validation
@Get(':id')
async getUser(@UUIDParam('id') userId: Uuid) {
  return this.service.getUser(userId);
}

// Multiple UUID parameters
@Post(':userId/posts/:postId')
async updateUserPost(
  @UUIDParam('userId') userId: Uuid,
  @UUIDParam('postId') postId: Uuid,
  @Body() updateDto: UpdatePostDto,
) {
  return this.service.updateUserPost(userId, postId, updateDto);
}
```

## API Documentation

### Swagger Documentation Patterns

```typescript
@Controller('users')
@ApiTags('users')
export class UserController {
  @Post()
  @HttpCode(HttpStatus.CREATED)
  @Auth([RoleType.ADMIN])
  @ApiOkResponse({
    type: UserDto,
    description: 'User created successfully'
  })
  @ApiBadRequestResponse({
    description: 'Invalid input data'
  })
  @ApiUnauthorizedResponse({
    description: 'Unauthorized access'
  })
  @ApiForbiddenResponse({
    description: 'Insufficient permissions'
  })
  async createUser(@Body() createUserDto: CreateUserDto): Promise<UserDto> {
    return this.service.createUser(createUserDto);
  }

  @Get()
  @Auth([RoleType.USER])
  @ApiPageResponse({
    description: 'Get paginated list of users',
    type: PageDto,
  })
  async getUsers(
    @Query(new ValidationPipe({ transform: true }))
    pageOptionsDto: UsersPageOptionsDto,
  ): Promise<PageDto<UserDto>> {
    return this.service.getUsers(pageOptionsDto);
  }

  @Post('upload-avatar')
  @Auth([RoleType.USER])
  @ApiFile({ name: 'avatar' })
  @ApiOkResponse({
    type: UserDto,
    description: 'Avatar uploaded successfully'
  })
  async uploadAvatar(
    @AuthUser() user: UserEntity,
    @UploadedFile() file: IFile,
  ): Promise<UserDto> {
    return this.service.updateAvatar(user.id, file);
  }
}
```

## Testing Patterns

### Unit Test Structure

```typescript
import { Test, TestingModule } from '@nestjs/testing';
import { DrizzleService } from '../../../database/drizzle.service';

import { UserNotFoundException } from '../../../exceptions/user-not-found.exception.ts';
import { User } from '../types/user.type.ts';
import { UserService } from '../user.service.ts';

describe('UserService', () => {
  let service: UserService;
  let mockDrizzleService: DrizzleService;

  const mockDrizzleService = {
    database: {
      select: jest.fn().mockReturnThis(),
      from: jest.fn().mockReturnThis(),
      where: jest.fn().mockReturnThis(),
      insert: jest.fn().mockReturnThis(),
      values: jest.fn().mockReturnThis(),
      returning: jest.fn(),
    },
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        UserService,
        {
          provide: DrizzleService,
          useValue: mockDrizzleService,
        },
      ],
    }).compile();

    service = module.get<UserService>(UserService);
    mockDrizzleService = module.get<DrizzleService>(DrizzleService);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('findOne', () => {
    it('should return user when found', async () => {
      const userId = 'test-uuid';
      const mockUser = { id: userId, email: 'test@test.com' };

      mockDrizzleService.database.select.mockReturnValue({
        from: jest.fn().mockReturnValue({
          where: jest.fn().mockResolvedValue([mockUser]),
        }),
      });

      const result = await service.findOne({ id: userId });

      expect(result).toEqual(mockUser);
      expect(mockDrizzleService.database.select).toHaveBeenCalled();
    });

    it('should throw UserNotFoundException when user not found', async () => {
      mockDrizzleService.database.select.mockReturnValue({
        from: jest.fn().mockReturnValue({
          where: jest.fn().mockResolvedValue([]),
        }),
      });

      await expect(service.findOne({ id: 'non-existent' }))
        .rejects
        .toThrow(UserNotFoundException);
    });
  });
});
```

### E2E Test Structure

```typescript
import { HttpStatus, INestApplication } from '@nestjs/common';
import { Test } from '@nestjs/testing';
import request from 'supertest';

import { AppModule } from '../../../app.module.ts';

describe('UserController (e2e)', () => {
  let app: INestApplication;

  beforeAll(async () => {
    const moduleFixture = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    app = moduleFixture.createNestApplication();
    await app.init();
  });

  afterAll(async () => {
    await app.close();
  });

  describe('POST /users', () => {
    it('should create a new user', () => {
      const createUserDto = {
        firstName: 'John',
        lastName: 'Doe',
        email: 'john@example.com',
        password: 'password123',
      };

      return request(app.getHttpServer())
        .post('/users')
        .send(createUserDto)
        .expect(HttpStatus.CREATED)
        .expect((res) => {
          expect(res.body.email).toBe(createUserDto.email);
          expect(res.body.password).toBeUndefined();
        });
    });

    it('should return validation error for invalid email', () => {
      const invalidDto = {
        firstName: 'John',
        lastName: 'Doe',
        email: 'invalid-email',
        password: 'password123',
      };

      return request(app.getHttpServer())
        .post('/users')
        .send(invalidDto)
        .expect(HttpStatus.BAD_REQUEST);
    });
  });
});
```

## Best Practices

### Code Organization

1. **Follow single responsibility principle**
2. **Keep modules focused and cohesive**
3. **Use meaningful names for files, classes, and methods**
4. **Group related functionality in modules**
5. **Separate concerns (controller, service, repository)**

### Performance

1. **Use pagination for list endpoints**
2. **Implement proper database indexing**
3. **Use query builders for complex queries**
4. **Optimize N+1 query problems with proper relations**
5. **Use caching where appropriate**

### Security

1. **Always validate input data**
2. **Use authentication and authorization consistently**
3. **Never expose sensitive data in responses**
4. **Use custom exceptions to avoid information leakage**
5. **Validate UUIDs with `@UUIDParam()`**

### Maintainability

1. **Write comprehensive tests**
2. **Use TypeScript strictly (avoid `any`)**
3. **Document APIs with Swagger**
4. **Follow consistent naming conventions**
5. **Keep methods small and focused**
6. **Use dependency injection properly**

### Type Safety

1. **Use proper typing for all function parameters and return values**
2. **Use `readonly` for DTO properties**
3. **Use `type` imports for type-only imports**
4. **Define proper interfaces for complex objects**
5. **Use union types and enums appropriately**

This guide should be used as a reference for all future development to ensure consistency across the codebase. When generating new code, follow these patterns and conventions to maintain the high quality and consistency of the project.
