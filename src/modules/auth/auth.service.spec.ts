import { UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { Test, type TestingModule } from '@nestjs/testing';

import { UserNotFoundException } from '../../exceptions/user-not-found.exception.ts';

import {
	UserFactory,
	UserLoginDtoFactory,
} from '../../../test/factories/index.ts';
import {
	mockConfigService,
	mockJwtService,
	mockUserService,
} from '../../../test/mocks/services.mock.ts';
import { validateHash } from '../../common/utils.ts';
import { ApiConfigService } from '../../shared/services/api-config.service.ts';
import { UserService } from '../user/user.service.ts';
import { AuthService } from './auth.service.ts';

// Mock the validateHash utility
jest.mock('../../common/utils.ts', () => ({
	validateHash: jest.fn(),
}));

describe('AuthService', () => {
	let service: AuthService;
	let _userService: UserService;
	let _jwtService: JwtService;
	let _apiConfigService: ApiConfigService;

	beforeEach(async () => {
		const module: TestingModule = await Test.createTestingModule({
			providers: [
				AuthService,
				{
					provide: UserService,
					useValue: mockUserService,
				},
				{
					provide: JwtService,
					useValue: mockJwtService,
				},
				{
					provide: ApiConfigService,
					useValue: mockConfigService,
				},
			],
		}).compile();

		service = module.get<AuthService>(AuthService);
		_userService = module.get<UserService>(UserService);
		_jwtService = module.get<JwtService>(JwtService);
		_apiConfigService = module.get<ApiConfigService>(ApiConfigService);
	});

	afterEach(() => {
		jest.clearAllMocks();
	});

	describe('validateUser', () => {
		it('should return user when credentials are valid', async () => {
			// Arrange
			const userLoginDto = UserLoginDtoFactory.create();
			const user = UserFactory.create({
				email: userLoginDto.email,
				password: 'hashed-password',
			});

			mockUserService.findOne.mockResolvedValue(user);
			(validateHash as jest.Mock).mockResolvedValue(true);

			// Act
			const result = await service.validateUser(userLoginDto);

			// Assert
			expect(result).toEqual(user);
			expect(mockUserService.findOne).toHaveBeenCalledWith({
				email: userLoginDto.email,
			});
			expect(validateHash).toHaveBeenCalledWith(
				userLoginDto.password,
				user.password,
			);
		});

		it('should throw UserNotFoundException when user not found', async () => {
			// Arrange
			const userLoginDto = UserLoginDtoFactory.create();
			mockUserService.findOne.mockResolvedValue(null); // User not found

			const mockValidateHash = validateHash as jest.MockedFunction<
				typeof validateHash
			>;
			mockValidateHash.mockResolvedValue(false);

			// Act & Assert
			await expect(service.validateUser(userLoginDto)).rejects.toThrow(
				UserNotFoundException,
			);
			expect(mockUserService.findOne).toHaveBeenCalledWith({
				email: userLoginDto.email,
			});
		});

		it('should throw UserNotFoundException when password is invalid', async () => {
			// Arrange
			const userLoginDto = UserLoginDtoFactory.create();
			const user = UserFactory.create({
				email: userLoginDto.email,
				password: 'hashed-password',
			});

			mockUserService.findOne.mockResolvedValue(user);
			(validateHash as jest.Mock).mockResolvedValue(false);

			// Act & Assert
			await expect(service.validateUser(userLoginDto)).rejects.toThrow(
				UserNotFoundException,
			);
			expect(validateHash).toHaveBeenCalledWith(
				userLoginDto.password,
				user.password,
			);
		});
	});

	describe('createAccessToken', () => {
		it('should create access token with correct payload', async () => {
			// Arrange
			const payload = { userId: 'test-user-id', role: 'USER' as const };
			const expectedToken = 'mock.jwt.token';
			const expectedExpiresIn = 3600;

			mockJwtService.signAsync.mockResolvedValue(expectedToken);

			// Act
			const result = await service.createAccessToken(payload);

			// Assert
			expect(result.token).toBe(expectedToken);
			expect(result.expiresIn).toBe(expectedExpiresIn);
			expect(mockJwtService.signAsync).toHaveBeenCalledWith({
				userId: payload.userId,
				type: 'ACCESS_TOKEN',
				role: payload.role,
			});
		});
	});
});
