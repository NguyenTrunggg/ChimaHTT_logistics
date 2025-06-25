import { ArticleStatus } from '@prisma/client';

export class CreateJobArticleDto {
  primary_image!: string;
  status!: ArticleStatus;
  job_deadline!: Date;
  job_title!: string;
  job_position!: string;
  job_location!: string;
  job_benefits?: string;
  job_description?: string;
  job_requirements?: string;
  meta_title?: string;
  meta_description?: string;
  content?: string;
  slug?: string;
}

export class UpdateJobArticleDto{
    primary_image?: string;
    status?: ArticleStatus;
    job_deadline?: Date;
    job_title?: string;
    job_position?: string;
    job_location?: string;
    job_benefits?: string;
    job_description?: string;
    job_requirements?: string;
    meta_title?: string;
    meta_description?: string;
    content?: string;
    slug?: string;
} 