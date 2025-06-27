export class CreateContainerDto {
  weight?: number; // kg
  vehicle_number?: string;
  container_number!: string;
  customer?: string;
  import_export!: "IMPORT" | "EXPORT";
  shipping_line?: string;
  seal?: string;
  service_type?: string;
  yard_in_date?: Date;
  yard_out_date?: Date;
  yard_position?: string;
  note?: string;
}

export class UpdateContainerDto {
  weight?: number;
  vehicle_number?: string;
  container_number?: string;
  customer?: string;
  import_export?: "IMPORT" | "EXPORT";
  shipping_line?: string;
  seal?: string;
  service_type?: string;
  yard_in_date?: Date;
  yard_out_date?: Date;
  yard_position?: string;
  note?: string;
} 