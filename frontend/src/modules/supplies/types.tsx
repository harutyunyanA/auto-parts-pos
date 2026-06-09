import type { IProduct } from "../products/types";

export interface ISupplyItem {
  id: number;
  minQuantity: number | null;
  productId: number;
  quantity: number;
  purchasePrice: string;
  salePrice: string;
  purchasePriceUsd: string | null;
  usdRate: string | null;
  weight: string | null;
  tax: string | null;
  product: Pick<IProduct, "quantity" | "name" | "type" | "id" | "weight">;
  createdAt: string;
  updatedAt: string;
}

export interface ISupply {
  id: number;
  supplierId: number;
  supplier?: { id: number; name: string; phone: string | null } | null;
  status: string;
  cashDeskId: number;
  items: ISupplyItem[];
  totalCost: string;
  createdAt: string;
  updatedAt: string;
}
