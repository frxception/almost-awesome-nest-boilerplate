import type { IQueryHandler } from '@nestjs/cqrs';
import { QueryHandler } from '@nestjs/cqrs';
import { eq } from 'drizzle-orm';

import { DrizzleService } from '../../../database/drizzle.service.ts';
import { posts } from '../../../database/schema/post.ts';
import type { Post } from '../types/post.type.ts';
import { GetPostQuery } from './get-post.query.ts';

@QueryHandler(GetPostQuery)
export class GetPostHandler implements IQueryHandler<GetPostQuery, Post[]> {
  constructor(private drizzleService: DrizzleService) {}

  // biome-ignore lint/suspicious/useAwait: <explanation>
  async execute(query: GetPostQuery): Promise<Post[]> {
    return this.drizzleService.database.select().from(posts).where(eq(posts.userId, query.userId));
  }
}
