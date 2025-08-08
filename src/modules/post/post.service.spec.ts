import { Test, TestingModule } from '@nestjs/testing';
import { CommandBus } from '@nestjs/cqrs';
import { sql } from 'drizzle-orm';

import { PostService } from './post.service.ts';
import { DrizzleService } from '../../database/drizzle.service.ts';
import { PostNotFoundException } from './exceptions/post-not-found.exception.ts';
import { mockDrizzleService } from '../../../test/mocks/drizzle.mock.ts';
import { mockCommandBus } from '../../../test/mocks/services.mock.ts';
import { PostFactory, CreatePostDtoFactory, UpdatePostDtoFactory } from '../../../test/factories/index.ts';
import { CreatePostCommand } from './commands/create-post.command.ts';
import { PostDto } from './dtos/post.dto.ts';
import { PostPageOptionsDto } from './dtos/post-page-options.dto.ts';

describe('PostService', () => {
  let service: PostService;
  let drizzleService: DrizzleService;
  let commandBus: CommandBus;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        PostService,
        {
          provide: DrizzleService,
          useValue: mockDrizzleService,
        },
        {
          provide: CommandBus,
          useValue: mockCommandBus,
        },
      ],
    }).compile();

    service = module.get<PostService>(PostService);
    drizzleService = module.get<DrizzleService>(DrizzleService);
    commandBus = module.get<CommandBus>(CommandBus);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('createPost', () => {
    it('should create a post using command bus', async () => {
      // Arrange
      const userId = 'test-user-id';
      const createPostDto = CreatePostDtoFactory.create();
      const expectedPost = PostFactory.create({ userId });

      mockCommandBus.execute.mockResolvedValue(expectedPost);

      // Act
      const result = await service.createPost(userId, createPostDto);

      // Assert
      expect(result).toEqual(expectedPost);
      expect(mockCommandBus.execute).toHaveBeenCalledWith(
        expect.any(CreatePostCommand)
      );
    });
  });

  describe('getSinglePost', () => {
    it('should return a post when found', async () => {
      // Arrange
      const postId = 'test-post-id';
      const expectedPost = PostFactory.create({ id: postId });

      mockDrizzleService.database.select.mockReturnValue({
        from: jest.fn().mockReturnValue({
          where: jest.fn().mockReturnValue({
            limit: jest.fn().mockResolvedValue([expectedPost]),
          }),
        }),
      });

      // Act
      const result = await service.getSinglePost(postId);

      // Assert
      expect(result).toEqual(expectedPost);
      expect(mockDrizzleService.database.select).toHaveBeenCalled();
    });

    it('should throw PostNotFoundException when post not found', async () => {
      // Arrange
      const postId = 'non-existent-post-id';

      mockDrizzleService.database.select.mockReturnValue({
        from: jest.fn().mockReturnValue({
          where: jest.fn().mockReturnValue({
            limit: jest.fn().mockResolvedValue([]),
          }),
        }),
      });

      // Act & Assert
      await expect(service.getSinglePost(postId)).rejects.toThrow(PostNotFoundException);
    });
  });

  describe('getAllPost', () => {
    it('should return paginated posts', async () => {
      // Arrange
      const pageOptionsDto = new PostPageOptionsDto();
      (pageOptionsDto as any).take = 10;
      (pageOptionsDto as any).page = 1;
      
      const posts = PostFactory.createMany(5);
      const totalCount = 25;

      mockDrizzleService.database.select
        .mockReturnValueOnce({
          from: jest.fn().mockReturnValue({
            orderBy: jest.fn().mockReturnValue({
              limit: jest.fn().mockReturnValue({
                offset: jest.fn().mockResolvedValue(posts),
              }),
            }),
          }),
        })
        .mockReturnValueOnce({
          from: jest.fn().mockResolvedValue([{ count: totalCount }]),
        });

      // Act
      const result = await service.getAllPost(pageOptionsDto);

      // Assert
      expect(result.data).toHaveLength(5);
      expect(result.meta.itemCount).toBe(totalCount);
      expect(result.data[0]).toBeInstanceOf(PostDto);
    });
  });

  describe('updatePost', () => {
    it('should update a post successfully', async () => {
      // Arrange
      const postId = 'test-post-id';
      const updatePostDto = UpdatePostDtoFactory.create();
      const existingPost = PostFactory.create({ id: postId });

      // Mock the select query to find the post first
      mockDrizzleService.database.select.mockReturnValue({
        from: jest.fn().mockReturnValue({
          where: jest.fn().mockReturnValue({
            limit: jest.fn().mockResolvedValue([existingPost]),
          }),
        }),
      });

      // Mock the update query
      mockDrizzleService.database.update.mockReturnValue({
        set: jest.fn().mockReturnValue({
          where: jest.fn().mockResolvedValue(undefined),
        }),
      });

      // Act
      const result = await service.updatePost(postId, updatePostDto);

      // Assert
      expect(result).toBeUndefined(); // updatePost returns void
      expect(mockDrizzleService.database.select).toHaveBeenCalled();
      expect(mockDrizzleService.database.update).toHaveBeenCalled();
    });
  });

  describe('deletePost', () => {
    it('should delete a post successfully', async () => {
      // Arrange
      const postId = 'test-post-id';
      const existingPost = PostFactory.create({ id: postId });

      // Mock the select query to find the post first
      mockDrizzleService.database.select.mockReturnValue({
        from: jest.fn().mockReturnValue({
          where: jest.fn().mockReturnValue({
            limit: jest.fn().mockResolvedValue([existingPost]),
          }),
        }),
      });

      // Mock the delete query
      mockDrizzleService.database.delete.mockReturnValue({
        where: jest.fn().mockResolvedValue(undefined),
      });

      // Act
      await service.deletePost(postId);

      // Assert
      expect(mockDrizzleService.database.select).toHaveBeenCalled();
      expect(mockDrizzleService.database.delete).toHaveBeenCalled();
    });

    it('should throw PostNotFoundException when post to delete not found', async () => {
      // Arrange
      const postId = 'non-existent-post-id';

      // Mock the select query to return empty array (post not found)
      mockDrizzleService.database.select.mockReturnValue({
        from: jest.fn().mockReturnValue({
          where: jest.fn().mockReturnValue({
            limit: jest.fn().mockResolvedValue([]), // Empty array means not found
          }),
        }),
      });

      // Act & Assert
      await expect(service.deletePost(postId)).rejects.toThrow(PostNotFoundException);
      expect(mockDrizzleService.database.select).toHaveBeenCalled();
    });
  });
});