import { pgTable, timestamp, uuid } from 'drizzle-orm/pg-core';

// Base table with common fields
export const baseTable = {
  id: uuid('id').primaryKey().defaultRandom(),
  createdAt: timestamp('created_at').defaultNow().notNull(),
  updatedAt: timestamp('updated_at').defaultNow().notNull(),
};

// Helper function to create a table with base fields
export const createBaseTable = (tableName: string) =>
  pgTable(tableName, baseTable);
