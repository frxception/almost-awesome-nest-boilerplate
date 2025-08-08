import type { ICommandHandler } from '@nestjs/cqrs';
import { CommandHandler } from '@nestjs/cqrs';

import type { LanguageCode } from '../../../constants/language-code.ts';
import type { DrizzleService } from '../../../database/drizzle.service.ts';
import { posts, postTranslations } from '../../../database/schema/post.ts';
import type { Post } from '../types/post.type.ts';
import type { PostTranslation } from '../types/post-translation.type.ts';
import { CreatePostCommand } from './create-post.command.ts';

@CommandHandler(CreatePostCommand)
export class CreatePostHandler
  implements ICommandHandler<CreatePostCommand, Post>
{
  constructor(private drizzleService: DrizzleService) {}

  async execute(command: CreatePostCommand): Promise<Post> {
    const { userId, createPostDto } = command;

    // Create post
    const [postEntity] = await this.drizzleService.database
      .insert(posts)
      .values({ userId })
      .returning();

    if (!postEntity) {
      throw new Error('Failed to create post');
    }

    // Create translations
    const translations: PostTranslation[] = [];

    for (const createTranslationDto of createPostDto.title) {
      const languageCode = createTranslationDto.languageCode;
      const description = createPostDto.description.find(
        (desc) => desc.languageCode === languageCode,
      )?.text;

      const [translationEntity] = await this.drizzleService.database
        .insert(postTranslations)
        .values({
          postId: postEntity.id,
          languageCode,
          title: createTranslationDto.text,
          description,
        })
        .returning();

      if (translationEntity) {
        translations.push({
          ...translationEntity,
          languageCode: translationEntity.languageCode as LanguageCode,
        });
      }
    }

    return postEntity;
  }
}
