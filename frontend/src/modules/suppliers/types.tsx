export type ISupplier = {
  id: number;
  name: string;
  phone: string | null;
};

export interface ICreateSupplierPayload {
  name: string;
  phone?: string | null;
}

export type IUpdateSupplierPayload = ICreateSupplierPayload;

export interface ISupplierSupplyItem {
  id: number;
  quantity: number;
  purchasePrice: string;
  salePrice: string | null;
  purchasePriceUsd: string | null;
  usdRate: string | null;
  weight: string | null;
  tax: string | null;
  product: {
    name: string;
    code: number;
    type: string;
    oem: string | null;
    WXQP: string | null;
  } | null;
}

export interface ISupplierSupply {
  id: number;
  totalCost: string | null;
  status: "draft" | "completed";
  createdAt: string;
  items: ISupplierSupplyItem[];
}

export interface ISupplierStats {
  totalSupplies: number;
  totalSpent: number;
  totalItems: number;
  lastSupplyAt: string | null;
}

export interface ISupplierSuppliesResponse {
  supplier: ISupplier;
  supplies: ISupplierSupply[];
  stats: ISupplierStats;
}
