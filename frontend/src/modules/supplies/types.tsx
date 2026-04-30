import type { IProduct } from "../products/types";

export interface ISupplyItem {
  id: number;
  minQuantity: number | null;
  productId: number;
  quantity: number;
  purchasePrice: string;
  salePrice: string;
  product: Pick<IProduct, "quantity" | "name" | "type" | "code">;
  createdAt: string;
  updatedAt: string;
}

export interface ISupply {
  id: number;
  supplierId: number;
  status: string;
  source: string;
  items: ISupplyItem[];
  totalCost: string;
  createdAt: string;
  updatedAt: string;
}
