export interface NewsTranslation {
  id: number;
  news_id: number;
  language: string;
  title: string;
  content: string;
}

export interface NewsCategoryTranslation {
  id: number;
  language: string;
  name: string;
  news_category_id: number;
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
  published_at: string;
  author_id: number;
  tag?: string;
  category_id: number;
  User: NewsAuthor;
  NewsCategory: NewsCategory;
  NewsTranslation: NewsTranslation[];
}

// For backward compatibility, add a type that supports both structures
export interface NewsArticleResponse {
  data: NewsArticle[];
  total: number;
  page: number;
  pageSize: number;
  totalPages: number;
} 