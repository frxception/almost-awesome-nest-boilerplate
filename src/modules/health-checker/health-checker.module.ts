import { Module } from '@nestjs/common';
import { TerminusModule } from '@nestjs/terminus';

import { DrizzleModule } from '../../database/drizzle.module.js';
import { HealthCheckerController } from './health-checker.controller.ts';
import { ServiceHealthIndicator } from './health-indicators/service.indicator.ts';

@Module({
  imports: [TerminusModule, DrizzleModule],
  controllers: [HealthCheckerController],
  providers: [ServiceHealthIndicator],
})
export class HealthCheckerModule {}
