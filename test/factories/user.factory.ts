import type { User } from '../../src/modules/user/types/user.type.ts';
import type { UserSettings } from '../../src/modules/user/types/user-settings.type.ts';
import { RoleType } from '../../src/constants/role-type.ts';

export class UserFactory {
  static create(overrides: Partial<User> = {}): User {
    const user: User = {
      id: overrides.id || 'test-user-uuid-123',
      firstName: overrides.firstName || 'John',
      lastName: overrides.lastName || 'Doe',
      email: overrides.email || 'john.doe@example.com',
      role: overrides.role || RoleType.USER,
      password: overrides.password || null,
      phone: overrides.phone || null,
      avatar: overrides.avatar || null,
      createdAt: overrides.createdAt || new Date('2024-01-01T00:00:00Z'),
      updatedAt: overrides.updatedAt || new Date('2024-01-01T00:00:00Z'),
    };

    return Object.assign({}, user, overrides);
  }

  static createMany(count: number, overrides: Partial<User> = {}): User[] {
    return Array.from({ length: count }, (_, index) =>
      this.create({ 
        ...overrides, 
        id: `test-user-uuid-${index}`,
        email: `user${index}@example.com` 
      })
    );
  }

  static createAdmin(overrides: Partial<User> = {}): User {
    return this.create({
      role: RoleType.ADMIN,
      email: 'admin@example.com',
      firstName: 'Admin',
      lastName: 'User',
      ...overrides,
    });
  }
}

export class UserSettingsFactory {
  static create(overrides: Partial<UserSettings> = {}): UserSettings {
    const settings: UserSettings = {
      id: overrides.id || 'test-settings-uuid-123',
      userId: overrides.userId || 'test-user-uuid-123',
      isEmailVerified: overrides.isEmailVerified ?? false,
      isPhoneVerified: overrides.isPhoneVerified ?? false,
      createdAt: overrides.createdAt || new Date('2024-01-01T00:00:00Z'),
      updatedAt: overrides.updatedAt || new Date('2024-01-01T00:00:00Z'),
    };

    return Object.assign({}, settings, overrides);
  }
}