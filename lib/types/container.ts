export interface Container {
  id: number;
  weight?: number;
  vehicleNumber?: string;
  containerNumber: string;
  customer?: string;
  importExport: "IMPORT" | "EXPORT";
  shippingLine?: string;
  seal?: string;
  serviceType?: string;
  yardInDate?: string | null; // ISO
  yardOutDate?: string | null;
  yardPosition?: string;
  note?: string;
  createdAt: string;
  updatedAt: string;
} 