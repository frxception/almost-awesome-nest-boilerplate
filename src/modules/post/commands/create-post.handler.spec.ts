import { Test, TestingModule } from '@nestjs/testing';

import { CreatePostHandler } from './create-post.handler.ts';
import { CreatePostCommand } from './create-post.command.ts';
import { DrizzleService } from '../../../database/drizzle.service.ts';
import { mockDrizzleService } from '../../../../test/mocks/drizzle.mock.ts';
import { PostFactory, CreatePostDtoFactory } from '../../../../test/factories/index.ts';

describe('CreatePostHandler', () => {
  let handler: CreatePostHandler;
  let drizzleService: DrizzleService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        CreatePostHandler,
        {
          provide: DrizzleService,
          useValue: mockDrizzleService,
        },
      ],
    }).compile();

    handler = module.get<CreatePostHandler>(CreatePostHandler);
    drizzleService = module.get<DrizzleService>(DrizzleService);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('execute', () => {
    it('should create post with translations', async () => {
      // Arrange
      const userId = 'test-user-id';
      const createPostDto = CreatePostDtoFactory.create();
      const command = new CreatePostCommand(userId, createPostDto);
      const expectedPost = PostFactory.create({ userId });

      // Mock the database operations directly
      mockDrizzleService.database.insert.mockReturnValue({
        values: jest.fn().mockReturnValue({
          returning: jest.fn()
            .mockResolvedValueOnce([expectedPost]) // Post creation
            .mockResolvedValue([{}]), // Translation creations
        }),
      });

      // Act
      const result = await handler.execute(command);

      // Assert
      expect(result).toEqual(expectedPost);
      expect(mockDrizzleService.database.insert).toHaveBeenCalledTimes(3); // 1 post + 2 translations
    });

    it('should handle database errors', async () => {
      // Arrange
      const userId = 'test-user-id';
      const createPostDto = CreatePostDtoFactory.create();
      const command = new CreatePostCommand(userId, createPostDto);

      mockDrizzleService.database.insert.mockReturnValue({
        values: jest.fn().mockReturnValue({
          returning: jest.fn().mockRejectedValue(new Error('Database error')),
        }),
      });

      // Act & Assert
      await expect(handler.execute(command)).rejects.toThrow('Database error');
    });

    it('should create post with multiple language translations', async () => {
      // Arrange
      const userId = 'test-user-id';
      const createPostDto = CreatePostDtoFactory.create({
        title: [
          { languageCode: 'en_US', text: 'English Title' },
          { languageCode: 'ru_RU', text: 'Русский заголовок' },
        ],
        description: [
          { languageCode: 'en_US', text: 'English description' },
          { languageCode: 'ru_RU', text: 'Русское описание' },
        ],
      });
      const command = new CreatePostCommand(userId, createPostDto);
      const expectedPost = PostFactory.create({ userId });
      const translation1 = { id: 'trans1', postId: expectedPost.id, languageCode: 'en_US' };
      const translation2 = { id: 'trans2', postId: expectedPost.id, languageCode: 'ru_RU' };

      mockDrizzleService.database.insert.mockReturnValue({
        values: jest.fn().mockReturnValue({
          returning: jest.fn()
            .mockResolvedValueOnce([expectedPost]) // Post creation
            .mockResolvedValueOnce([translation1]) // First translation
            .mockResolvedValueOnce([translation2]), // Second translation
        }),
      });

      // Act
      const result = await handler.execute(command);

      // Assert
      expect(result).toEqual(expectedPost);
      expect(mockDrizzleService.database.insert).toHaveBeenCalledTimes(3); // 1 post + 2 translations
    });
  });
});