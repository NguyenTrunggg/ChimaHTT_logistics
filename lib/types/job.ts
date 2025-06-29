export interface JobArticleTranslation {
  id: number;
  language: string;
  slug?: string;
  content?: string;
  job_title: string;
  job_position: string;
  job_location: string;
  job_benefits?: string;
  job_description?: string;
  job_requirements?: string;
  meta_title?: string;
  meta_description?: string;
}

export type ArticleStatus = "draft" | "published";

export interface JobArticleAuthor {
  id: number;
  username: string;
}

export interface JobArticle {
  id: number;
  primary_image: string;
  status: ArticleStatus;
  published_at?: string | Date;
  created_at: string | Date;
  updated_at: string | Date;
  job_deadline: string | Date;
  author: JobArticleAuthor;
  translations: JobArticleTranslation[];
} 