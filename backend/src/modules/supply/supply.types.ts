import type { sourceType } from "../../types/source.types.ts";

export type SupplyType = {
  id: number;
  supplierId: number | null;
  totalCost: string | null;
  source: sourceType;
  createdAt: Date;
  updatedAt: Date;
};

export type SupplyItemType = {
  code: number;
  quantity: number;
  purchasePrice: number;
  salePrice: number;
  minQuantity?: number;
};

export type Supply = {
  supplierId: number;
  source: sourceType;
  items: SupplyItemType[];
};
