import { Test, type TestingModule } from '@nestjs/testing';

import { PostFactory } from '../../../../test/factories/index.ts';
import { mockDrizzleService } from '../../../../test/mocks/drizzle.mock.ts';
import { DrizzleService } from '../../../database/drizzle.service.ts';
import { GetPostHandler } from './get-post.handler.ts';
import { GetPostQuery } from './get-post.query.ts';

describe('GetPostHandler', () => {
	let handler: GetPostHandler;
	let _drizzleService: DrizzleService;

	beforeEach(async () => {
		const module: TestingModule = await Test.createTestingModule({
			providers: [
				GetPostHandler,
				{
					provide: DrizzleService,
					useValue: mockDrizzleService,
				},
			],
		}).compile();

		handler = module.get<GetPostHandler>(GetPostHandler);
		_drizzleService = module.get<DrizzleService>(DrizzleService);
	});

	afterEach(() => {
		jest.clearAllMocks();
	});

	describe('execute', () => {
		it('should get posts by userId', async () => {
			// Arrange
			const userId = 'test-user-id';
			const query = new GetPostQuery(userId);
			const expectedPosts = PostFactory.createMany(2, { userId });

			mockDrizzleService.database.select.mockReturnValue({
				from: jest.fn().mockReturnValue({
					where: jest.fn().mockResolvedValue(expectedPosts),
				}),
			});

			// Act
			const result = await handler.execute(query);

			// Assert
			expect(result).toEqual(expectedPosts);
			expect(mockDrizzleService.database.select).toHaveBeenCalled();
		});

		it('should return empty array when no posts found', async () => {
			// Arrange
			const userId = 'user-with-no-posts';
			const query = new GetPostQuery(userId);

			mockDrizzleService.database.select.mockReturnValue({
				from: jest.fn().mockReturnValue({
					where: jest.fn().mockResolvedValue([]),
				}),
			});

			// Act
			const result = await handler.execute(query);

			// Assert
			expect(result).toEqual([]);
			expect(mockDrizzleService.database.select).toHaveBeenCalled();
		});

		it('should propagate database errors', async () => {
			// Arrange
			const userId = 'test-user-id';
			const query = new GetPostQuery(userId);
			const error = new Error('Database error');

			mockDrizzleService.database.select.mockReturnValue({
				from: jest.fn().mockReturnValue({
					where: jest.fn().mockRejectedValue(error),
				}),
			});

			// Act & Assert
			await expect(handler.execute(query)).rejects.toThrow('Database error');
		});
	});
});
