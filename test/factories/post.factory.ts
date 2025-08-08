import type { CreatePostDto } from '../../src/modules/post/dtos/create-post.dto.ts';
import type { UpdatePostDto } from '../../src/modules/post/dtos/update-post.dto.ts';
import type { PostTranslation } from '../../src/modules/post/types/post-translation.type.ts';
import type { Post } from '../../src/modules/post/types/post.type.ts';

export class PostFactory {
	static create(overrides: Partial<Post> = {}): Post {
		const post: Post = {
			id: overrides.id || 'test-post-uuid-123',
			userId: overrides.userId || 'test-user-uuid-123',
			createdAt: overrides.createdAt || new Date('2024-01-01T00:00:00Z'),
			updatedAt: overrides.updatedAt || new Date('2024-01-01T00:00:00Z'),
		};

		return Object.assign({}, post, overrides);
	}

	static createMany(count: number, overrides: Partial<Post> = {}): Post[] {
		return Array.from({ length: count }, (_, index) =>
			this.create({
				...overrides,
				id: `test-post-uuid-${index}`,
			}),
		);
	}

	static createWithTranslations(
		overrides: Partial<Post> = {},
	): Post & { translations: PostTranslation[] } {
		const post = this.create(overrides);
		return {
			...post,
			translations: PostTranslationFactory.createMany(2, { postId: post.id }),
		};
	}
}

export class PostTranslationFactory {
	static create(overrides: Partial<PostTranslation> = {}): PostTranslation {
		const translation: PostTranslation = {
			id: overrides.id || 'test-translation-uuid-123',
			postId: overrides.postId || 'test-post-uuid-123',
			languageCode: overrides.languageCode || 'en_US',
			title: overrides.title || 'Test Post Title',
			description: overrides.description || 'Test post description content.',
			createdAt: overrides.createdAt || new Date('2024-01-01T00:00:00Z'),
			updatedAt: overrides.updatedAt || new Date('2024-01-01T00:00:00Z'),
		};

		return Object.assign({}, translation, overrides);
	}

	static createMany(
		count: number,
		overrides: Partial<PostTranslation> = {},
	): PostTranslation[] {
		const languages = ['en_US', 'ru_RU'];
		return Array.from({ length: count }, (_, index) =>
			this.create({
				...overrides,
				id: `test-translation-uuid-${index}`,
				languageCode: languages[index % languages.length] as 'en_US' | 'ru_RU',
				title: `Test Title ${index}`,
				description: `Test description content ${index}.`,
			}),
		);
	}
}

export class CreatePostDtoFactory {
	static create(overrides: Partial<CreatePostDto> = {}): CreatePostDto {
		return {
			title: [
				{ languageCode: 'en_US', text: 'English Title' },
				{ languageCode: 'ru_RU', text: 'Русский заголовок' },
			],
			description: [
				{ languageCode: 'en_US', text: 'English description content.' },
				{ languageCode: 'ru_RU', text: 'Русское описание содержимого.' },
			],
			...overrides,
		};
	}
}

export class UpdatePostDtoFactory {
	static create(overrides: Partial<UpdatePostDto> = {}): UpdatePostDto {
		return {
			title: [
				{ languageCode: 'en_US', text: 'Updated English Title' },
				{ languageCode: 'ru_RU', text: 'Обновленный русский заголовок' },
			],
			description: [
				{ languageCode: 'en_US', text: 'Updated English description.' },
				{ languageCode: 'ru_RU', text: 'Обновленное русское описание.' },
			],
			...overrides,
		};
	}
}
