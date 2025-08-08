import { Module } from '@nestjs/common';
import { CqrsModule } from '@nestjs/cqrs';

import { DrizzleModule } from '../../database/drizzle.module.ts';
import { CreatePostHandler } from './commands/create-post.handler.ts';
import { PostController } from './post.controller.ts';
import { PostService } from './post.service.ts';
import { GetPostHandler } from './queries/get-post.handler.ts';

const handlers = [CreatePostHandler, GetPostHandler];

@Module({
  imports: [CqrsModule, DrizzleModule],
  providers: [PostService, ...handlers],
  controllers: [PostController],
})
export class PostModule {}
