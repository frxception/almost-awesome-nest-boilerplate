import type { UserLoginDto } from '../../src/modules/auth/dto/user-login.dto.ts';
import type { UserRegisterDto } from '../../src/modules/auth/dto/user-register.dto.ts';
import type { LoginPayloadDto } from '../../src/modules/auth/dto/login-payload.dto.ts';
import type { TokenPayloadDto } from '../../src/modules/auth/dto/token-payload.dto.ts';
import { UserFactory } from './user.factory.ts';

export class UserLoginDtoFactory {
  static create(overrides: Partial<UserLoginDto> = {}): UserLoginDto {
    return {
      email: overrides.email || 'test@example.com',
      password: overrides.password || 'password123',
      ...overrides,
    };
  }
}

export class UserRegisterDtoFactory {
  static create(overrides: Partial<UserRegisterDto> = {}): UserRegisterDto {
    return {
      firstName: overrides.firstName || 'John',
      lastName: overrides.lastName || 'Doe',
      email: overrides.email || 'test@example.com',
      password: overrides.password || 'password123',
      phone: overrides.phone || null,
      ...overrides,
    };
  }
}

export class TokenPayloadDtoFactory {
  static create(overrides: Partial<TokenPayloadDto> = {}): TokenPayloadDto {
    return {
      expiresIn: overrides.expiresIn || 3600,
      accessToken: overrides.accessToken || 'mock.jwt.token',
      ...overrides,
    };
  }
}

export class LoginPayloadDtoFactory {
  static create(overrides: Partial<{ user: any; token: TokenPayloadDto }> = {}): LoginPayloadDto {
    const user = overrides.user || UserFactory.create();
    const token = overrides.token || TokenPayloadDtoFactory.create();
    
    return new LoginPayloadDto(user, token);
  }
}