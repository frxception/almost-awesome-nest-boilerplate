import { Test, TestingModule } from '@nestjs/testing';
import { HttpStatus } from '@nestjs/common';

import { AuthController } from './auth.controller.ts';
import { UserService } from '../user/user.service.ts';
import { AuthService } from './auth.service.ts';
import { mockUserService, mockAuthService } from '../../../test/mocks/services.mock.ts';
import { 
  UserFactory, 
  UserLoginDtoFactory, 
  UserRegisterDtoFactory,
  TokenPayloadDtoFactory 
} from '../../../test/factories/index.ts';
import { UserDto } from '../user/dtos/user.dto.ts';
import { LoginPayloadDto } from './dto/login-payload.dto.ts';

describe('AuthController', () => {
  let controller: AuthController;
  let userService: UserService;
  let authService: AuthService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [AuthController],
      providers: [
        {
          provide: UserService,
          useValue: mockUserService,
        },
        {
          provide: AuthService,
          useValue: mockAuthService,
        },
      ],
    }).compile();

    controller = module.get<AuthController>(AuthController);
    userService = module.get<UserService>(UserService);
    authService = module.get<AuthService>(AuthService);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('userLogin', () => {
    it('should login user and return login payload', async () => {
      // Arrange
      const userLoginDto = UserLoginDtoFactory.create();
      const user = UserFactory.create({ email: userLoginDto.email });
      const token = TokenPayloadDtoFactory.create();

      mockAuthService.validateUser.mockResolvedValue(user);
      mockAuthService.createAccessToken.mockResolvedValue(token);

      // Act
      const result = await controller.userLogin(userLoginDto);

      // Assert
      expect(result).toBeInstanceOf(LoginPayloadDto);
      expect(mockAuthService.validateUser).toHaveBeenCalledWith(userLoginDto);
      expect(mockAuthService.createAccessToken).toHaveBeenCalledWith({
        userId: user.id,
        role: user.role,
      });
    });
  });

  describe('userRegister', () => {
    it('should register user without avatar', async () => {
      // Arrange
      const userRegisterDto = UserRegisterDtoFactory.create();
      const createdUser = UserFactory.create(userRegisterDto);

      mockUserService.createUser.mockResolvedValue(createdUser);

      // Act
      const result = await controller.userRegister(userRegisterDto);

      // Assert
      expect(result).toBeInstanceOf(UserDto);
      expect(mockUserService.createUser).toHaveBeenCalledWith(userRegisterDto, undefined);
    });
  });

  describe('userRegisterWithAvatar', () => {
    it('should register user with avatar', async () => {
      // Arrange
      const userRegisterDto = UserRegisterDtoFactory.create();
      const file = { key: 'avatar-key.jpg' };
      const createdUser = UserFactory.create({ ...userRegisterDto, avatar: file.key });

      mockUserService.createUser.mockResolvedValue(createdUser);

      // Act
      const result = await controller.userRegisterWithAvatar(userRegisterDto, file);

      // Assert
      expect(result).toBeInstanceOf(UserDto);
      expect(mockUserService.createUser).toHaveBeenCalledWith(userRegisterDto, file);
    });
  });

  describe('getCurrentUser', () => {
    it('should return current user DTO', () => {
      // Arrange
      const user = UserFactory.create();

      // Act
      const result = controller.getCurrentUser(user);

      // Assert
      expect(result).toBeInstanceOf(UserDto);
      expect(result.id).toBe(user.id);
    });
  });
});
