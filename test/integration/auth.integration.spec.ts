import { ConfigModule } from '@nestjs/config';
import { JwtModule } from '@nestjs/jwt';
import { Test, type TestingModule } from '@nestjs/testing';

import { DrizzleModule } from '../../src/database/drizzle.module.ts';
import { AuthModule } from '../../src/modules/auth/auth.module.ts';
import { AuthService } from '../../src/modules/auth/auth.service.ts';
import { UserModule } from '../../src/modules/user/user.module.ts';
import { UserService } from '../../src/modules/user/user.service.ts';
import {
	UserFactory,
	UserLoginDtoFactory,
	UserRegisterDtoFactory,
} from '../factories/index.ts';
import { RoleType } from '../../src/constants/role-type.ts';
import { Uuid } from '../../src/types.ts';

describe('Auth Module Integration', () => {
	let module: TestingModule;
	let authService: AuthService;
	let userService: UserService;

	beforeAll(async () => {
		module = await Test.createTestingModule({
			imports: [
				ConfigModule.forRoot({
					isGlobal: true,
					envFilePath: '.env.test',
				}),
				JwtModule.register({
					secret: 'test-jwt-secret',
					signOptions: { expiresIn: '1h' },
				}),
				DrizzleModule,
				UserModule,
				AuthModule,
			],
		}).compile();

		authService = module.get<AuthService>(AuthService);
		userService = module.get<UserService>(UserService);
	});

	afterAll(async () => {
		await module.close();
	});

	describe('Authentication Flow', () => {
		it('should be defined', () => {
			expect(authService).toBeDefined();
			expect(userService).toBeDefined();
		});

		// Note: These tests would require actual database setup for full integration
		// In a real scenario, you would use a test database
		it('should validate module dependencies are wired correctly', () => {
			expect(authService).toBeInstanceOf(AuthService);
			expect(userService).toBeInstanceOf(UserService);
		});
	});

	describe('Token Generation', () => {
		it('should create valid JWT tokens', async () => {
			// Arrange
			const payload = { userId: 'test-user-id', role: RoleType.USER as RoleType};

			// Act
			const tokenResult = await authService.createAccessToken(payload as { role: RoleType; userId: Uuid });

			// Assert
			expect(tokenResult.token).toBeDefined();
			expect(tokenResult.expiresIn).toBe(3600);
			expect(typeof tokenResult.token).toBe('string');
		});
	});
});
