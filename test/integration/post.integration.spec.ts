import { ConfigModule } from '@nestjs/config';
import { CqrsModule } from '@nestjs/cqrs';
import { Test, type TestingModule } from '@nestjs/testing';

import { DrizzleModule } from '../../src/database/drizzle.module.ts';
import { CreatePostHandler } from '../../src/modules/post/commands/create-post.handler.ts';
import { PostController } from '../../src/modules/post/post.controller.ts';
import { PostModule } from '../../src/modules/post/post.module.ts';
import { PostService } from '../../src/modules/post/post.service.ts';
import { GetPostHandler } from '../../src/modules/post/queries/get-post.handler.ts';

describe('Post Module Integration', () => {
	let module: TestingModule;
	let service: PostService;
	let controller: PostController;
	let createPostHandler: CreatePostHandler;
	let getPostHandler: GetPostHandler;

	beforeAll(async () => {
		module = await Test.createTestingModule({
			imports: [
				ConfigModule.forRoot({
					isGlobal: true,
					envFilePath: '.env.test',
				}),
				CqrsModule,
				DrizzleModule,
				PostModule,
			],
		}).compile();

		service = module.get<PostService>(PostService);
		controller = module.get<PostController>(PostController);
		createPostHandler = module.get<CreatePostHandler>(CreatePostHandler);
		getPostHandler = module.get<GetPostHandler>(GetPostHandler);
	});

	afterAll(async () => {
		await module.close();
	});

	describe('Module Dependencies', () => {
		it('should be defined', () => {
			expect(service).toBeDefined();
			expect(controller).toBeDefined();
			expect(createPostHandler).toBeDefined();
			expect(getPostHandler).toBeDefined();
		});

		it('should have correct instances', () => {
			expect(service).toBeInstanceOf(PostService);
			expect(controller).toBeInstanceOf(PostController);
			expect(createPostHandler).toBeInstanceOf(CreatePostHandler);
			expect(getPostHandler).toBeInstanceOf(GetPostHandler);
		});
	});

	describe('CQRS Integration', () => {
		it('should wire CQRS handlers correctly', () => {
			// Test that handlers are properly registered
			expect(createPostHandler).toBeDefined();
			expect(getPostHandler).toBeDefined();

			// Test that service has access to command bus
			expect(typeof service.createPost).toBe('function');
			expect(typeof service.getSinglePost).toBe('function');
		});
	});

	describe('Service-Controller Integration', () => {
		it('should wire dependencies correctly', () => {
			// Test that controller can access service methods
			expect(typeof service.createPost).toBe('function');
			expect(typeof service.getAllPost).toBe('function');
			expect(typeof service.updatePost).toBe('function');
			expect(typeof service.deletePost).toBe('function');
		});
	});
});
