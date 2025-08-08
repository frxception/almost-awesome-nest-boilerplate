import { Test, TestingModule } from '@nestjs/testing';
import { ConfigModule } from '@nestjs/config';

import { UserModule } from '../../src/modules/user/user.module.ts';
import { DrizzleModule } from '../../src/database/drizzle.module.ts';
import { UserService } from '../../src/modules/user/user.service.ts';
import { UserController } from '../../src/modules/user/user.controller.ts';

describe('User Module Integration', () => {
  let module: TestingModule;
  let service: UserService;
  let controller: UserController;

  beforeAll(async () => {
    module = await Test.createTestingModule({
      imports: [
        ConfigModule.forRoot({
          isGlobal: true,
          envFilePath: '.env.test',
        }),
        DrizzleModule,
        UserModule,
      ],
    }).compile();

    service = module.get<UserService>(UserService);
    controller = module.get<UserController>(UserController);
  });

  afterAll(async () => {
    await module.close();
  });

  describe('Module Dependencies', () => {
    it('should be defined', () => {
      expect(service).toBeDefined();
      expect(controller).toBeDefined();
    });

    it('should have correct service and controller instances', () => {
      expect(service).toBeInstanceOf(UserService);
      expect(controller).toBeInstanceOf(UserController);
    });
  });

  describe('Service-Controller Integration', () => {
    it('should wire dependencies correctly', () => {
      // Test that controller can access service methods
      expect(typeof service.getUser).toBe('function');
      expect(typeof service.getUsers).toBe('function');
      expect(typeof service.createUser).toBe('function');
    });
  });
});