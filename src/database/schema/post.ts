import { pgEnum, pgTable, uuid, varchar } from 'drizzle-orm/pg-core';

import { baseTable } from './base.ts';

// Enums
export const languageCodeEnum = pgEnum('post_translations_language_code_enum', [
  'en_US',
  'ru_RU',
]);

// Posts table
export const posts = pgTable('posts', {
  ...baseTable,
  userId: uuid('user_id').notNull(),
});

// Post translations table
export const postTranslations = pgTable('post_translations', {
  ...baseTable,
  title: varchar('title').notNull(),
  description: varchar('description').notNull(),
  postId: uuid('post_id').notNull(),
  languageCode: languageCodeEnum('language_code').notNull(),
});
