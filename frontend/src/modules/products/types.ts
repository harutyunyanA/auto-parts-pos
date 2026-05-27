import type { ISupplier } from "../suppliers/types";

export interface IProduct {
  id: number;
  name: string;
  type: string;
  oem: string;
  code: number;
  WXQP: string;
  source: string;
  quantity: number;
  minimum_quantity: number;
  purchase_price: number;
  sale_price: number;
  weight?: number | null;
  supplier_id: number;
  supplier?: ISupplier;
}
