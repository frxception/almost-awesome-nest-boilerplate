import { Test, TestingModule } from '@nestjs/testing';

import { PostController } from './post.controller.ts';
import { PostService } from './post.service.ts';
import { mockPostService } from '../../../test/mocks/services.mock.ts';
import { 
  UserFactory, 
  PostFactory, 
  CreatePostDtoFactory, 
  UpdatePostDtoFactory 
} from '../../../test/factories/index.ts';
import { PostDto } from './dtos/post.dto.ts';
import { PostPageOptionsDto } from './dtos/post-page-options.dto.ts';
import { PageDto } from '../../common/dto/page.dto.ts';
import { PageMetaDto } from '../../common/dto/page-meta.dto.ts';

describe('PostController', () => {
  let controller: PostController;
  let service: PostService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [PostController],
      providers: [
        {
          provide: PostService,
          useValue: mockPostService,
        },
      ],
    }).compile();

    controller = module.get<PostController>(PostController);
    service = module.get<PostService>(PostService);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('createPost', () => {
    it('should create a post and return DTO', async () => {
      // Arrange
      const user = UserFactory.create();
      const createPostDto = CreatePostDtoFactory.create();
      const createdPost = PostFactory.create({ userId: user.id });
      const postDto = new PostDto(createdPost);

      mockPostService.createPost.mockResolvedValue(createdPost);

      // Act
      const result = await controller.createPost(createPostDto, user);

      // Assert
      expect(result).toBeInstanceOf(PostDto);
      expect(mockPostService.createPost).toHaveBeenCalledWith(user.id, createPostDto);
    });
  });

  describe('getSinglePost', () => {
    it('should return a post DTO', async () => {
      // Arrange
      const postId = 'test-post-id';
      const post = PostFactory.create({ id: postId });
      const postDto = new PostDto(post);

      mockPostService.getSinglePost.mockResolvedValue(post);

      // Act
      const result = await controller.getSinglePost(postId);

      // Assert
      expect(result).toBeInstanceOf(PostDto);
      expect(mockPostService.getSinglePost).toHaveBeenCalledWith(postId);
    });
  });

  describe('getPosts', () => {
    it('should return paginated posts', async () => {
      // Arrange
      const pageOptionsDto = new PostPageOptionsDto();
      const posts = PostFactory.createMany(3);
      const postDtos = posts.map(post => new PostDto(post));
      const pageMetaDto = new PageMetaDto({ itemCount: 15, pageOptionsDto });
      const pageDto = new PageDto(postDtos, pageMetaDto);

      mockPostService.getAllPost.mockResolvedValue(pageDto);

      // Act
      const result = await controller.getPosts(pageOptionsDto);

      // Assert
      expect(result).toEqual(pageDto);
      expect(result.data).toHaveLength(3);
      expect(mockPostService.getAllPost).toHaveBeenCalledWith(pageOptionsDto);
    });
  });

  describe('updatePost', () => {
    it('should update a post successfully', async () => {
      // Arrange
      const postId = 'test-post-id';
      const updatePostDto = UpdatePostDtoFactory.create();

      mockPostService.updatePost.mockResolvedValue(undefined);

      // Act
      const result = await controller.updatePost(postId, updatePostDto);

      // Assert
      expect(result).toBeUndefined(); // updatePost returns void
      expect(mockPostService.updatePost).toHaveBeenCalledWith(postId, updatePostDto);
    });
  });

  describe('deletePost', () => {
    it('should delete a post successfully', async () => {
      // Arrange
      const postId = 'test-post-id';
      const user = UserFactory.create();

      mockPostService.deletePost.mockResolvedValue(undefined);

      // Act
      await controller.deletePost(postId, user);

      // Assert
      expect(mockPostService.deletePost).toHaveBeenCalledWith(postId);
    });
  });
});