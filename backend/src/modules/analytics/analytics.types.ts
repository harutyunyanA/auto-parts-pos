export type SupplierStat = {
  supplierId: number | null;
  name: string;
  purchased: number; // сколько закуплено у поставщика (по completed supplies)
  supplyCount: number;
  sold: number; // выручка с продаж его товаров
  cogs: number; // себестоимость проданного
  profit: number; // sold - cogs
  soldQty: number;
};

export type DeadStockItem = {
  id: number;
  code: number | null;
  name: string;
  type: string;
  oem: string | null;
  quantity: number;
  purchase_price: number;
  sale_price: number;
  frozenValue: number; // quantity * purchase_price — сколько денег заморожено
};
