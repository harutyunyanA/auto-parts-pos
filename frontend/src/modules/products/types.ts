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
  discount: number;
  weight?: number | null;
  supplier_id: number;
  supplier?: ISupplier;
}

export interface AddProductProps {
  onClose: () => void;
}

export interface AddProductFormValues {
  name: string;
  type?: string;
  oem?: string;
  WXQP?: string;
  quantity: number;
  purchase_price: number;
  sale_price: number;
  enable_minimum_quantity?: boolean;
  minimum_quantity?: number;
  supplier_id?: number;
}

export interface AddProductPayload {
  name: string;
  type?: string;
  oem?: string | null;
  WXQP?: string | null;
  quantity: number;
  purchase_price: number;
  sale_price: number;
  minimum_quantity: number | null;
  supplier_id?: number | null;
}
