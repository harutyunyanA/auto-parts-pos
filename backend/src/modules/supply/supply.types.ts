import type { sourceType } from "../../types/source.types.ts";

export type SupplyType = {
  id: number;
  supplierId: number | null;
  totalCost: string | null;
  source: sourceType;
  // items: SupplyItemType[];
  status: "draft" | "completed";
  createdAt: Date;
  updatedAt: Date;
};

export type SupplyItemType = {
  productId: number;
  quantity: number;
  purchasePrice: number;
  salePrice: number;
  oldPurchasePrice: number;
  oldSalePrice: number;
  minQuantity?: number;
};

export type Supply = {
  supplierId: number;
  source: sourceType;
  items: SupplyItemType[];
};
