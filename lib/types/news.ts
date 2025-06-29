export interface NewsTranslation {
  id: number;
  language: string;
  title: string;
  content: string;
}

export interface NewsCategoryTranslation {
  id: number;
  language: string;
  name: string;
}

export interface NewsCategory {
  id: number;
  translations: NewsCategoryTranslation[];
}

export interface NewsAuthor {
  id: number;
  username: string;
}

export interface NewsArticle {
  id: number;
  main_image: string;
  published_at: string | Date;
  tag?: string;
  author: NewsAuthor;
  category: NewsCategory;
  translations: NewsTranslation[];
}

// For backward compatibility with existing admin code that still uses snake_case keys
export interface LegacyNewsArticle {
  id: number;
  main_image: string;
  published_at: string;
  author_id: number;
  tag?: string;
  category_id: number;
  User: NewsAuthor;
  NewsCategory: NewsCategory;
  NewsTranslation: NewsTranslation[];
}

export type NewsArticleAny = NewsArticle | LegacyNewsArticle;

export interface NewsArticleResponse {
  data: NewsArticleAny[];
  total: number;
  page: number;
  pageSize: number;
  totalPages: number;
} 