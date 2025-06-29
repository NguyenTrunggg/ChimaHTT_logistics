export interface ServiceTranslation {
  id: number;
  language: string;
  title: string;
  content: string;
  features: Record<string, any>;
}

export interface LogisticService {
  id: number;
  main_image: string;
  ServiceTranslation: ServiceTranslation[];
} 