import type { Optional } from "sequelize";
import type { CartItem } from "../sale/sale.model.ts";
import type { CartItemType } from "../sale/sale.types.ts";
import type { SupplyItem } from "../supply/supply.model.ts";

export type ProductType = {
  id: number;
  name: string;
  type: string;
  oem?: string | null;
  WXQP?: string | null;
  quantity: number;
  minimum_quantity?: number | null;
  purchase_price: number;
  sale_price: number;
  discount: number;
  weight?: number | null;
  supplier_id: number | null;
  createdAt: Date;
  updatedAt: Date;
};

export type ProductCreationType = Optional<
  ProductType,
  "id" | "oem" | "WXQP" | "minimum_quantity" | "weight" | "discount"
>;

export type searchParams = {
  id?: number;
  type?: string;
  name?: string;
  oem?: string;
  WXQP?: string;
  discounted?: boolean;
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
    id: number;
    name: string;
    oem: string;
    type: string;
  };
  createdAt: string;
};

export type SuppliedProductsHistoryRow = SupplyItem & {
  product: {
    id: number;
    name: string;
    oem: string;
    type: string;
  };
  createdAt: string;
};

  