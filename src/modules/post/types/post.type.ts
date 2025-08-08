import type { posts } from '../../../database/schema/post.ts';

export type Post = typeof posts.$inferSelect;
