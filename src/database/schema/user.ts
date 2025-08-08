import { boolean, pgEnum, pgTable, uuid, varchar } from 'drizzle-orm/pg-core';

import { baseTable } from './base.ts';

// Enums
export const roleEnum = pgEnum('users_role_enum', ['USER', 'ADMIN']);

// Users table
export const users = pgTable('users', {
  ...baseTable,
  firstName: varchar('first_name'),
  lastName: varchar('last_name'),
  role: roleEnum('role').default('USER').notNull(),
  email: varchar('email').unique(),
  password: varchar('password'),
  phone: varchar('phone'),
  avatar: varchar('avatar'),
});

// User settings table
export const userSettings = pgTable('user_settings', {
  ...baseTable,
  isEmailVerified: boolean('is_email_verified').default(false).notNull(),
  isPhoneVerified: boolean('is_phone_verified').default(false).notNull(),
  userId: uuid('user_id').notNull().unique(),
});
