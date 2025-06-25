export class CreateNewsDto {
  main_image!: string;
  category_id!: number;
  tag?: string;
  title!: string;
  content!: string;
}

export class UpdateNewsDto {
  main_image?: string;
  category_id?: number;
  tag?: string;
  title?: string;
  content?: string;
}