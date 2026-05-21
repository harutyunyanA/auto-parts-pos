export type IHistory = {
  id: number;
  code: number;
  serial_number: string;
  name: string;
  type: string;
  saledProduct: SaledProduct | null;
  suppliedProduct: SuppliedProduct | null;
  operation: "IN" | "OUT";
};

export type SaledProduct = {
  cardId: string;
  quantity: number;
  salePrice: number;
  totalCost: number;
  client?: {
    id: number;
    name: string;
  };
  createdAt: string;
};

export type SuppliedProduct = {
  supplyId: string;
  quantity: number;
  purchasePrice: number;
  totalCost: number;
  supplier: {
    id: number;
    name: string;
  };
  createdAt: string;
};
