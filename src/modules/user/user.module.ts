import { Module } from '@nestjs/common';
import { CqrsModule } from '@nestjs/cqrs';

import { DrizzleModule } from '../../database/drizzle.module.ts';
import { CreateSettingsHandler } from './commands/create-settings.command.ts';
import { UserController } from './user.controller.ts';
import { UserService } from './user.service.ts';

const handlers = [CreateSettingsHandler];

@Module({
  imports: [CqrsModule, DrizzleModule],
  controllers: [UserController],
  exports: [UserService],
  providers: [UserService, ...handlers],
})
export class UserModule {}
