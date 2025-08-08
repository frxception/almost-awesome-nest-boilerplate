import { Controller, Get } from '@nestjs/common';
import type { HealthCheckResult } from '@nestjs/terminus';
import { HealthCheck, type HealthCheckService } from '@nestjs/terminus';

import type { ServiceHealthIndicator } from './health-indicators/service.indicator.ts';

@Controller('health')
export class HealthCheckerController {
  constructor(
    private healthCheckService: HealthCheckService,
    private serviceIndicator: ServiceHealthIndicator,
  ) {}

  @Get()
  @HealthCheck()
  async check(): Promise<HealthCheckResult> {
    return this.healthCheckService.check([
      () => this.serviceIndicator.isHealthy('search-service-health'),
    ]);
  }
}
