import { Test, type TestingModule } from '@nestjs/testing';

import { CommandBus } from '@nestjs/cqrs';
import { UserFactory } from '../../../test/factories';
import { mockDrizzleService } from '../../../test/mocks/drizzle.mock';
import { mockAwsS3Service, mockCommandBus, mockValidatorService } from '../../../test/mocks/services.mock';
import { DrizzleService } from '../../database/drizzle.service';
import { AwsS3Service } from '../../shared/services/aws-s3.service';
import { ValidatorService } from '../../shared/services/validator.service';
import { Uuid } from '../../types';
import type { UserRegisterDto } from '../auth/dto/user-register.dto';
import { UserDto } from './dtos/user.dto';
import { UsersPageOptionsDto } from './dtos/users-page-options.dto';
import { UserService } from './user.service';

describe('UserService', () => {
  let service: UserService;
  let _drizzleService: DrizzleService;
  let _validatorService: ValidatorService;
  let _awsS3Service: AwsS3Service;
  let _commandBus: CommandBus;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        UserService,
        {
          provide: DrizzleService,
          useValue: mockDrizzleService,
        },
        {
          provide: ValidatorService,
          useValue: mockValidatorService,
        },
        {
          provide: AwsS3Service,
          useValue: mockAwsS3Service,
        },
        {
          provide: CommandBus,
          useValue: mockCommandBus,
        },
      ],
    }).compile();

    service = module.get<UserService>(UserService);
    _drizzleService = module.get<DrizzleService>(DrizzleService);
    _validatorService = module.get<ValidatorService>(ValidatorService);
    _awsS3Service = module.get<AwsS3Service>(AwsS3Service);
    _commandBus = module.get<CommandBus>(CommandBus);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('createUser', () => {
    it('should create a user successfully', async () => {
      // Arrange
      const userRegisterDto: UserRegisterDto = {
        firstName: 'John',
        lastName: 'Doe',
        email: 'john.doe@example.com',
        password: 'password123',
      };
      const expectedUser = UserFactory.create(userRegisterDto);

      mockDrizzleService.database.insert.mockReturnValue({
        values: jest.fn().mockReturnValue({
          returning: jest.fn().mockResolvedValue([expectedUser]),
        }),
      });

      // Act
      const result = await service.createUser(userRegisterDto);

      // Assert
      expect(result).toEqual(expectedUser);
      expect(mockDrizzleService.database.insert).toHaveBeenCalled();
    });

    it('should create a user with avatar file', async () => {
      // Arrange
      const userRegisterDto: UserRegisterDto = {
        firstName: 'John',
        lastName: 'Doe',
        email: 'john.doe@example.com',
        password: 'password123',
      };
      const file = { key: 'avatar-key.jpg' };
      const expectedUser = UserFactory.create({
        ...userRegisterDto,
        avatar: file.key,
      });

      mockDrizzleService.database.insert.mockReturnValue({
        values: jest.fn().mockReturnValue({
          returning: jest.fn().mockResolvedValue([expectedUser]),
        }),
      });

      // Act
      const result = await service.createUser(userRegisterDto, file as any);

      // Assert
      expect(result).toEqual(expectedUser);
      expect(mockDrizzleService.database.insert).toHaveBeenCalled();
    });
  });

  describe('findOne', () => {
    it('should return user when found', async () => {
      // Arrange
      const email = 'test@example.com';
      const expectedUser = UserFactory.create({ email });

      mockDrizzleService.database.select.mockReturnValue({
        from: jest.fn().mockReturnValue({
          where: jest.fn().mockReturnValue({
            limit: jest.fn().mockResolvedValue([expectedUser]),
          }),
        }),
      });

      // Act
      const result = await service.findOne({ email });

      // Assert
      expect(result).toEqual(expectedUser);
      expect(mockDrizzleService.database.select).toHaveBeenCalled();
    });

    it('should return null when user not found', async () => {
      // Arrange
      const email = 'nonexistent@example.com';

      mockDrizzleService.database.select.mockReturnValue({
        from: jest.fn().mockReturnValue({
          where: jest.fn().mockReturnValue({
            limit: jest.fn().mockResolvedValue([]), // Empty array means not found
          }),
        }),
      });

      // Act
      const result = await service.findOne({ email });

      // Assert
      expect(result).toBeNull();
    });
  });

  describe('getUser', () => {
    it('should return UserDto when user exists', async () => {
      // Arrange
      const userId = 'test-user-id';
      const user = UserFactory.create({ id: userId });

      mockDrizzleService.database.select.mockReturnValue({
        from: jest.fn().mockReturnValue({
          where: jest.fn().mockReturnValue({
            limit: jest.fn().mockResolvedValue([user]), // Return user in array
          }),
        }),
      });

      // Act
      const result = await service.getUser(userId as Uuid);

      // Assert
      expect(result).toBeInstanceOf(UserDto);
      expect(result.id).toBe(userId);
    });
  });

  describe('getUsers', () => {
    it('should return paginated users', async () => {
      // Arrange
      const pageOptionsDto = new UsersPageOptionsDto();
      (pageOptionsDto as any).take = 10;
      (pageOptionsDto as any).page = 1;

      const users = UserFactory.createMany(5);
      const totalCount = 50;

      mockDrizzleService.database.select
        .mockReturnValueOnce({
          from: jest.fn().mockReturnValue({
            orderBy: jest.fn().mockReturnValue({
              limit: jest.fn().mockReturnValue({
                offset: jest.fn().mockResolvedValue(users),
              }),
            }),
          }),
        })
        .mockReturnValueOnce({
          from: jest.fn().mockResolvedValue([{ count: totalCount }]),
        });

      // Act
      const result = await service.getUsers(pageOptionsDto);

      // Assert
      expect(result.data).toHaveLength(5);
      expect(result.meta.itemCount).toBe(totalCount);
      expect(result.data[0]).toBeInstanceOf(UserDto);
    });
  });
});
