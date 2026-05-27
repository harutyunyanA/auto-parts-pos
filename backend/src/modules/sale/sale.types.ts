import type { sourceType } from "../../types/source.types.ts";

export type CartType = {
  id: number;
  status: "draft" | "completed";
  totalAmount: number;
  paymentMethod: "cash" | "card";
  source: sourceType;
  createdAt: Date;
  updatedAt: Date;
};

export type CartItemType = {
  id: number;
  cartId: number;
  productId: number;
  quantity: number;
  priceAtSale: number;
  totalPrice: number;
};

export type TransformedCartType = {
  id: number;
  status: "draft" | "completed";
  totalAmount: number;
  paymentMethod: "cash" | "card";
  source: sourceType;
  createdAt: Date;
  updatedAt: Date;
  items: TransformedCartItemType[];
}

export type TransformedCartItemType = {
  id: number;
  cartId: number;
  productId: number;
  quantity: number;
  quantityAtStore: number;
  priceAtSale: number;
  totalPrice: number;
  name: string;
  type: string;
  oem: string;
  WXQP: string;
  quantity_at_store: number;
}
  