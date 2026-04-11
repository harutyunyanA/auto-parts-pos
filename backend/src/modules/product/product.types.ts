import type { Optional } from "sequelize";
import type { sourceType } from "../../types/source.types.ts";

export type ProductType = {
  id: number;
  name: string;
  type: string;
  serial_number?: string | null;
  WXQP?: string | null;
  code: number | null;
  source: sourceType;
  quantity: number;
  minimum_quantity?: number | null;
  purchase_price: number;
  sale_price: number;
  supplier_id: number | null;
  createdAt: Date;
  updatedAt: Date;
};

export type ProductCreationType = Optional<
  ProductType,
  "id" | "serial_number" | "WXQP" | "minimum_quantity" | "code"
>;
