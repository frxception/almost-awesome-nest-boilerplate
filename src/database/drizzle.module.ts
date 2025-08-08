import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { drizzle } from 'drizzle-orm/node-postgres';
import { Pool } from 'pg';

import { DrizzleService } from './drizzle.service.ts';
import * as schema from './schema/index.ts';

@Module({
  imports: [ConfigModule],
  providers: [
    {
      provide: 'DATABASE_POOL',
      useFactory: () =>
        new Pool({
          host: process.env.DB_HOST,
          port: Number(process.env.DB_PORT),
          user: process.env.DB_USERNAME,
          password: process.env.DB_PASSWORD,
          database: process.env.DB_DATABASE,
          ssl: false,
        }),
    },
    {
      provide: 'DATABASE',
      useFactory: (pool: Pool) => drizzle(pool, { schema }),
      inject: ['DATABASE_POOL'],
    },
    DrizzleService,
  ],
  exports: ['DATABASE', 'DATABASE_POOL', DrizzleService],
})
export class DrizzleModule {}
