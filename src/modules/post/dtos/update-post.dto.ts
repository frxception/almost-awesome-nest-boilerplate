import { CreateTranslationDto } from '../../../common/dto/create-translation.dto.ts';
import { TranslationsFieldOptional } from '../../../decorators/field.decorators.ts';

export class UpdatePostDto {
  @TranslationsFieldOptional({ type: CreateTranslationDto })
  title?: CreateTranslationDto[];

  @TranslationsFieldOptional({ type: CreateTranslationDto })
  description?: CreateTranslationDto[];
}
