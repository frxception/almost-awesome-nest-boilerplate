import { DateField, UUIDField } from '../../decorators/field.decorators.ts';
import { DYNAMIC_TRANSLATION_DECORATOR_KEY } from '../../decorators/translate.decorator.ts';
import type { Post } from '../../modules/post/types/post.type.ts';
import type { PostTranslation } from '../../modules/post/types/post-translation.type.ts';
import type { User } from '../../modules/user/types/user.type.ts';
import { ContextProvider } from '../../providers/context.provider.ts';
import type { Uuid } from '../../types.ts';

export class AbstractDto {
  @UUIDField()
  id!: Uuid;

  @DateField()
  createdAt!: Date;

  @DateField()
  updatedAt!: Date;

  translations?: AbstractTranslationDto[];

  constructor(
    entity: User | Post | PostTranslation,
    options?: { excludeFields?: boolean },
  ) {
    if (!options?.excludeFields) {
      this.id = entity.id as Uuid;
      this.createdAt = entity.createdAt;
      this.updatedAt = entity.updatedAt;
    }

    // Handle translations for Post entities only
    if ('translations' in entity && entity.translations) {
      const languageCode = ContextProvider.getLanguage();

      if (languageCode && Array.isArray(entity.translations)) {
        const translationEntity = entity.translations.find(
          (titleTranslation: any) =>
            titleTranslation.languageCode === languageCode,
        );

        if (translationEntity) {
          const fields: Record<string, string> = {};

          for (const key of Object.keys(translationEntity)) {
            // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
            const metadata = Reflect.getMetadata(
              DYNAMIC_TRANSLATION_DECORATOR_KEY,
              this,
              key,
            );

            if (metadata) {
              fields[key] = (translationEntity as never)[key];
            }
          }

          Object.assign(this, fields);
        }
      }
    }
  }
}

export class AbstractTranslationDto extends AbstractDto {
  constructor(entity: PostTranslation) {
    super(entity, { excludeFields: true });
  }
}
