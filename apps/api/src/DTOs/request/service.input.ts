export class CreateServiceDto {
  main_image!: string;
  title!: string;
  content!: string;
  features!: Record<string, any>;
}

export class UpdateServiceDto  {
  main_image?: string;
  title?: string;
  content?: string;
  features?: Record<string, any>;
}