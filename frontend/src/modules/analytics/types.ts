export type TopProductsSort = "qty" | "revenue";

export interface ISupplierStat {
  supplierId: number | null;
  name: string;
  purchased: number;
  supplyCount: number;
  sold: number;
  cogs: number;
  profit: number;
  soldQty: number;
}

export interface ITopProduct {
  productId: number;
  name: string;
  code: number | null;
  oem: string | null;
  type: string;
  qtySold: number;
  revenue: number;
  cogs: number;
  profit: number;
}

export interface IDeadStockItem {
  id: number;
  code: number | null;
  name: string;
  type: string;
  oem: string | null;
  quantity: number;
  purchase_price: number;
  sale_price: number;
  frozenValue: number;
}

export interface IDateRange {
  from?: string;
  to?: string;
}
