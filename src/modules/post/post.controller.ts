/* eslint-disable simple-import-sort/imports */
import { Body, Controller, Delete, Get, HttpCode, HttpStatus, Post, Put, Query } from '@nestjs/common';
import { ApiAcceptedResponse, ApiCreatedResponse, ApiOkResponse, ApiTags } from '@nestjs/swagger';

import type { PageDto } from '../../common/dto/page.dto.ts';
import { RoleType } from '../../constants/role-type.ts';
import { ApiPageResponse } from '../../decorators/api-page-response.decorator.ts';
import { AuthUser } from '../../decorators/auth-user.decorator.ts';
import { ApiUUIDParam, Auth, UUIDParam } from '../../decorators/http.decorators.ts';
import { UseLanguageInterceptor } from '../../interceptors/language-interceptor.service.ts';
import type { Uuid } from '../../types.ts';
import type { User } from '../user/types/user.type.ts';
import type { CreatePostDto } from './dtos/create-post.dto.ts';
import type { PostPageOptionsDto } from './dtos/post-page-options.dto.ts';
import { PostDto } from './dtos/post.dto.ts';
import type { UpdatePostDto } from './dtos/update-post.dto.ts';
import { PostService } from './post.service.ts';

@Controller('posts')
@ApiTags('posts')
export class PostController {
  constructor(private postService: PostService) {}

  @Post()
  @Auth([RoleType.USER])
  @HttpCode(HttpStatus.CREATED)
  @ApiCreatedResponse({ type: PostDto })
  async createPost(@Body() createPostDto: CreatePostDto, @AuthUser() user: User) {
    const postEntity = await this.postService.createPost(user.id as Uuid, createPostDto);

    return new PostDto(postEntity);
  }

  // biome-ignore lint/suspicious/useAwait: <explanation>
  @Get()
  @Auth([RoleType.USER])
  @UseLanguageInterceptor()
  @ApiPageResponse({ type: PostDto })
  async getPosts(@Query() postsPageOptionsDto: PostPageOptionsDto): Promise<PageDto<PostDto>> {
    return this.postService.getAllPost(postsPageOptionsDto);
  }

  @Get(':id')
  @Auth([])
  @HttpCode(HttpStatus.OK)
  @ApiUUIDParam('id')
  @ApiOkResponse({ type: PostDto })
  async getSinglePost(@UUIDParam('id') id: Uuid): Promise<PostDto> {
    const entity = await this.postService.getSinglePost(id);

    return new PostDto(entity);
  }

  @Put(':id')
  @HttpCode(HttpStatus.OK)
  @ApiUUIDParam('id')
  @ApiOkResponse({ type: PostDto })
  async updatePost(@UUIDParam('id') id: Uuid, @Body() updatePostDto: UpdatePostDto): Promise<PostDto> {
    const post = await this.postService.updatePost(id, updatePostDto);

    return new PostDto(post);
  }

  @Delete(':id')
  @HttpCode(HttpStatus.ACCEPTED)
  @ApiUUIDParam('id')
  @ApiAcceptedResponse()
  async deletePost(@UUIDParam('id') id: Uuid): Promise<void> {
    await this.postService.deletePost(id);
  }
}
