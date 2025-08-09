import type { ICommand, ICommandHandler } from '@nestjs/cqrs';
import { CommandHandler } from '@nestjs/cqrs';

import type { DrizzleService } from '../../../database/drizzle.service.ts';
import { userSettings } from '../../../database/schema/user.ts';
import type { Uuid } from '../../../types.ts';
import type { CreateSettingsDto } from '../dtos/create-settings.dto.ts';
import type { UserSettings } from '../types/user-settings.type.ts';

export class CreateSettingsCommand implements ICommand {
  constructor(
    public readonly userId: Uuid,
    public readonly createSettingsDto: CreateSettingsDto,
  ) {}
}

@CommandHandler(CreateSettingsCommand)
export class CreateSettingsHandler implements ICommandHandler<CreateSettingsCommand, UserSettings> {
  constructor(private drizzleService: DrizzleService) {}

  async execute(command: CreateSettingsCommand): Promise<UserSettings> {
    const { userId, createSettingsDto } = command;

    const [userSettingsEntity] = await this.drizzleService.database
      .insert(userSettings)
      .values({
        ...createSettingsDto,
        userId,
      })
      .returning();

    if (!userSettingsEntity) {
      throw new Error('Failed to create user settings');
    }

    return userSettingsEntity;
  }
}
