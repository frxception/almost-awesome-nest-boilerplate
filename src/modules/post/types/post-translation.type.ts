import type { LanguageCode } from '../../../constants/language-code.ts';

export interface PostTranslation {
  id: string;
  createdAt: Date;
  updatedAt: Date;
  title: string;
  description: string;
  postId: string;
  languageCode: LanguageCode;
}
