export class CreateSystemConfigDto {
  key!  : string;
  value!: string;
}

export class UpdateSystemConfigDto extends CreateSystemConfigDto {} 