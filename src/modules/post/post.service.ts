import { Injectable } from '@nestjs/common';
import { CommandBus } from '@nestjs/cqrs';
import { asc, desc, eq, sql } from 'drizzle-orm';

import type { PageDto } from '../../common/dto/page.dto.ts';
import { Order } from '../../constants/order.ts';
import { DrizzleService } from '../../database/drizzle.service.ts';
import { posts } from '../../database/schema/post.ts';
import type { Uuid } from '../../types.ts';
import { CreatePostCommand } from './commands/create-post.command.ts';
import type { CreatePostDto } from './dtos/create-post.dto.ts';
import { PostDto } from './dtos/post.dto.ts';
import type { PostPageOptionsDto } from './dtos/post-page-options.dto.ts';
import type { UpdatePostDto } from './dtos/update-post.dto.ts';
import { PostNotFoundException } from './exceptions/post-not-found.exception.ts';
import type { Post } from './types/post.type.ts';

@Injectable()
export class PostService {
  constructor(
    private drizzleService: DrizzleService,
    private commandBus: CommandBus,
  ) {}

  createPost(userId: Uuid, createPostDto: CreatePostDto): Promise<Post> {
    return this.commandBus.execute<CreatePostCommand, Post>(new CreatePostCommand(userId, createPostDto));
  }

  async getAllPost(postPageOptionsDto: PostPageOptionsDto): Promise<PageDto<PostDto>> {
    const { page, take, order } = postPageOptionsDto;
    const offset = (page - 1) * take;

    const orderBy = order === Order.ASC ? asc(posts.createdAt) : desc(posts.createdAt);

    const [items, totalCount] = await Promise.all([
      this.drizzleService.database.select().from(posts).orderBy(orderBy).limit(take).offset(offset),
      this.drizzleService.database
        .select({ count: sql`count(*)` })
        .from(posts)
        .then((result) => Number(result[0]?.count ?? 0)),
    ]);

    const pageMetaDto = {
      page,
      take,
      itemCount: totalCount,
      pageCount: Math.ceil(totalCount / take),
      hasPreviousPage: page > 1,
      hasNextPage: page < Math.ceil(totalCount / take),
    };

    return {
      data: items.map((post) => new PostDto(post)),
      meta: pageMetaDto,
    };
  }

  async getSinglePost(id: Uuid): Promise<Post> {
    const [post] = await this.drizzleService.database.select().from(posts).where(eq(posts.id, id)).limit(1);

    if (!post) {
      throw new PostNotFoundException();
    }

    return post;
  }

  async updatePost(id: Uuid, _updatePostDto: UpdatePostDto): Promise<Post> {
    const [post] = await this.drizzleService.database.select().from(posts).where(eq(posts.id, id)).limit(1);

    if (!post) {
      throw new PostNotFoundException();
    }

    // TODO: Implement translation updates
    // For now, just return the existing post since no actual post fields need updating
    // The translation updates would need to be handled separately

    return post;
  }

  async deletePost(id: Uuid): Promise<void> {
    const [post] = await this.drizzleService.database.select().from(posts).where(eq(posts.id, id)).limit(1);

    if (!post) {
      throw new PostNotFoundException();
    }

    await this.drizzleService.database.delete(posts).where(eq(posts.id, id));
  }
}
