import type { Optional } from "sequelize";

export type ProductAttributes = {
  id: number;
  name: string;
  type: string;
  serial_number?: string | null;
  WXQP?: string | null;
  code: number;
  source: "soviet" | "import";
  quantity: number;
  minimum_quantity?: number | null;
  purchase_price: number;
  sale_price: number;
  supplier_id: number | null;
  createdAt: Date;
  updatedAt: Date;
};

export type ProductCreationAttributes = Optional<
  ProductAttributes,
  "id" | "serial_number" | "WXQP" | "minimum_quantity" | "code"
>;
