export class ServiceTranslationResponseDto {
  id!: number;
  language!: string;
  title!: string;
  content!: string;
  features!: Record<string, any>;
}

export class ServiceResponseDto {
  id!: number;
  main_image!: string;
  translations!: ServiceTranslationResponseDto[];
} 