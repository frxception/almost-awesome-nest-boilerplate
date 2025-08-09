import { Test, type TestingModule } from '@nestjs/testing';

import { UserFactory } from '../../../test/factories';
import { mockTranslationService, mockUserService } from '../../../test/mocks/services.mock';
import { PageMetaDto } from '../../common/dto/page-meta.dto';
import { PageDto } from '../../common/dto/page.dto';
import { TranslationService } from '../../shared/services/translation.service';
import { Uuid } from '../../types';
import { UserDto } from './dtos/user.dto';
import { UsersPageOptionsDto } from './dtos/users-page-options.dto';
import { UserController } from './user.controller';
import { UserService } from './user.service';

describe('UserController', () => {
  let controller: UserController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [UserController],
      providers: [
        {
          provide: UserService,
          useValue: mockUserService,
        },
        {
          provide: TranslationService,
          useValue: mockTranslationService,
        },
      ],
    }).compile();

    controller = module.get<UserController>(UserController);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('getUser', () => {
    it('should return a user DTO', async () => {
      // Arrange
      const userId = 'test-user-id';
      const userDto = new UserDto(UserFactory.create({ id: userId }));

      mockUserService.getUser.mockResolvedValue(userDto);

      // Act
      const result = await controller.getUser(userId as Uuid);

      // Assert
      expect(result).toEqual(userDto);
      expect(mockUserService.getUser).toHaveBeenCalledWith(userId);
    });
  });

  describe('getUsers', () => {
    it('should return paginated users', async () => {
      // Arrange
      const pageOptionsDto = new UsersPageOptionsDto();
      (pageOptionsDto as any).take = 10;
      (pageOptionsDto as any).page = 1;

      const users = UserFactory.createMany(5);
      const userDtos = users.map((user) => new UserDto(user));
      const pageMetaDto = new PageMetaDto({ itemCount: 25, pageOptionsDto });
      const pageDto = new PageDto(userDtos, pageMetaDto);

      mockUserService.getUsers.mockResolvedValue(pageDto);

      // Act
      const result = await controller.getUsers(pageOptionsDto);

      // Assert
      expect(result).toEqual(pageDto);
      expect(result.data).toHaveLength(5);
      expect(mockUserService.getUsers).toHaveBeenCalledWith(pageOptionsDto);
    });

    it('should handle empty results', async () => {
      // Arrange
      const pageOptionsDto = new UsersPageOptionsDto();
      const pageMetaDto = new PageMetaDto({ itemCount: 0, pageOptionsDto });
      const emptyPageDto = new PageDto([], pageMetaDto);

      mockUserService.getUsers.mockResolvedValue(emptyPageDto);

      // Act
      const result = await controller.getUsers(pageOptionsDto);

      // Assert
      expect(result.data).toHaveLength(0);
      expect(result.meta.itemCount).toBe(0);
      expect(mockUserService.getUsers).toHaveBeenCalledWith(pageOptionsDto);
    });
  });
});
