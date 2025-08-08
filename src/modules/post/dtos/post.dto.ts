import { ApiPropertyOptional } from '@nestjs/swagger';

import { AbstractDto } from '../../../common/dto/abstract.dto.ts';
import {
  DynamicTranslate,
  StaticTranslate,
} from '../../../decorators/translate.decorator.ts';
import type { Post } from '../types/post.type.ts';
import { PostTranslationDto } from './post-translation.dto.ts';

export class PostDto extends AbstractDto {
  @ApiPropertyOptional()
  @DynamicTranslate()
  title?: string;

  @ApiPropertyOptional()
  description?: string;

  @ApiPropertyOptional()
  @StaticTranslate()
  info: string;

  @ApiPropertyOptional({ type: PostTranslationDto, isArray: true })
  declare translations?: PostTranslationDto[];

  constructor(postEntity: Post) {
    super(postEntity);

    this.info = 'keywords.admin';
  }
}
