import type { Optional } from "sequelize";
import type { sourceType } from "../../types/source.types.ts";
import type { CartItem } from "../sale/sale.model.ts";
import type { CartItemType } from "../sale/sale.types.ts";
import type { SupplyItem } from "../supply/supply.model.ts";

export type ProductType = {
  id: number;
  name: string;
  type: string;
  oem?: string | null;
  WXQP?: string | null;
  code: number | null;
  source: sourceType;
  quantity: number;
  minimum_quantity?: number | null;
  purchase_price: number;
  sale_price: number;
  weight?: number | null;
  supplier_id: number | null;
  createdAt: Date;
  updatedAt: Date;
};

export type ProductCreationType = Optional<
  ProductType,
  "id" | "oem" | "WXQP" | "minimum_quantity" | "code" | "weight"
>;

export type searchParams = {
  code?: number;
  type?: string;
  name?: string;
  oem?: string;
  WXQP?: string;
};

export type paginationParams = {
  page?: number;
  limit?: number;
};

// export type SaledProductsHistoryRow = Omit<CartItemType, "productId"> & {
//   product: {
//     code: number;
//     name: string;
//     oem: string;
//     type: string;
//   };
//   createdAt: string;
// };
export type SoldProductsHistoryRow = CartItem & {
  product: {
    code: number;
    name: string;
    oem: string;
    type: string;
  };
  createdAt: string;
};

export type SuppliedProductsHistoryRow = SupplyItem & {
  product: {
    code: number;
    name: string;
    oem: string;
    type: string;
  };
  createdAt: string;
};

  