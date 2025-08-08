import { Inject, Injectable, type OnModuleDestroy } from '@nestjs/common';
import type { NodePgDatabase } from 'drizzle-orm/node-postgres';
import type { Pool } from 'pg';

import type * as schema from './schema/index.ts';

@Injectable()
export class DrizzleService implements OnModuleDestroy {
  constructor(
    @Inject('DATABASE')
    private readonly _db: NodePgDatabase<typeof schema>,
    @Inject('DATABASE_POOL')
    private readonly _pool: Pool,
  ) {}

  get database(): NodePgDatabase<typeof schema> {
    return this.db;
  }

  async onModuleDestroy() {
    await this.pool.end();
  }
}
