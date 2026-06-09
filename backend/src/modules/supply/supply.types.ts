export type SupplyType = {
  id: number;
  supplierId: number | null;
  totalCost: string | null;
  cashDeskId: number;
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
  minQuantity?: number | null;
  purchasePriceUsd?: number | null;
  usdRate?: number | null;
  weight?: number | null;
  tax?: number | null;
};
