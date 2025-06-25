export class NewsTranslationResponseDto {
  id!: number;
  language!: string;
  title!: string;
  content!: string;
}

export class NewsResponseDto {
  id!: number;
  main_image!: string;
  published_at!: Date;
  tag?: string;
  author!: {
    id: number;
    username: string;
  };
  category!: {
    id: number;
    translations: {
      language: string;
      name: string;
    }[];
  };
  translations!: NewsTranslationResponseDto[];
} 