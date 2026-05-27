type HistoryBase = {
  id: number;
  quantity: number;
  createdAt: string;
  product: {
    code: number;
    name: string;
    type: string;
    oem: string;
  };
};

export type HistorySoldRow = HistoryBase & {
  operation: "OUT";
  cartId: number;
  priceAtSale: number;
  totalPrice: number;
};

export type HistorySuppliedRow = HistoryBase & {
  operation: "IN";
  supplyId: number;
  purchasePrice: number;
  totalCost: number;
};

export type IHistory = HistorySoldRow | HistorySuppliedRow;
