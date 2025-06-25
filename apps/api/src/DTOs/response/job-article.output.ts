import { ArticleStatus } from '@prisma/client';

export class JobArticleTranslationResponseDto {
  id!: number;
  language!: string;
  slug?: string;
  content?: string;
  job_title!: string;
  job_position!: string;
  job_location!: string;
  job_benefits?: string;
  job_description?: string;
  job_requirements?: string;
  meta_title?: string;
  meta_description?: string;
}

export class JobArticleResponseDto {
  id!: number;
  primary_image!: string;
  status!: ArticleStatus;
  published_at?: Date;
  created_at!: Date;
  updated_at!: Date;
  job_deadline!: Date;
  author!: {
    id: number;
    username: string;
  };
  translations!: JobArticleTranslationResponseDto[];
} 