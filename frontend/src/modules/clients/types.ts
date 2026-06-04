export type IClient = {
  id: number;
  name: string;
  phone: string | null;
};

export interface ICreateClientPayload {
  name: string;
  phone?: string | null;
}

export type IUpdateClientPayload = ICreateClientPayload;

export interface IClientPurchaseItem {
  id: number;
  quantity: number;
  priceAtSale: number;
  totalPrice: number;
  code: number | null;
  name: string;
  type: string;
  oem: string | null;
}

export interface IClientPurchase {
  id: number;
  createdAt: string;
  totalAmount: number;
  bonusAmount: number;
  bonusPaid: boolean;
  items: IClientPurchaseItem[];
}

export interface IClientStats {
  totalPurchases: number;
  totalSpent: number;
  bonusPercent: number;
  bonusAccrued: number;
  bonusOutstanding: number;
  bonusPaid: number;
}

export interface IClientPurchasesResponse {
  client: IClient;
  purchases: IClientPurchase[];
  stats: IClientStats;
  source: "soviet" | "import";
}
