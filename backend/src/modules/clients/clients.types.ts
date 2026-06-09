export type ClientType = {
  id: number;
  name: string;
  phone: string | null;
  createdAt: Date;
  updatedAt: Date;
};

export type ClientCreationType = Omit<
  ClientType,
  "id" | "createdAt" | "updatedAt"
>;

export type ClientPurchaseItem = {
  id: number;
  quantity: number;
  priceAtSale: number;
  totalPrice: number;
  productId: number | null;
  name: string;
  type: string;
  oem: string | null;
};

export type ClientPurchase = {
  id: number;
  createdAt: Date;
  totalAmount: number;
  bonusAmount: number;
  bonusPaid: boolean;
  items: ClientPurchaseItem[];
};

export type ClientStats = {
  totalPurchases: number;
  totalSpent: number;
  bonusPercent: number;
  bonusAccrued: number;
  bonusOutstanding: number;
  bonusPaid: number;
};

export type ClientPurchasesResponse = {
  client: ClientType;
  purchases: ClientPurchase[];
  stats: ClientStats;
};
