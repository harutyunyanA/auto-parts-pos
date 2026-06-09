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

export interface IDeadStockItem {
  id: number;
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
