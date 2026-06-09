export interface ICart {
  id: number;
  clientId: number | null;
  client?: { id: number; name: string } | null;
  cashDeskId: number;
  cashDesk?: { id: number; name: string } | null;
  bonusPaid: boolean;
  totalAmount: number;
  status: "draft" | "completed";
  paymentMethod: "cash" | "card";
  createdAt: string;
  updatedAt: string;
  items: ICartItem[];
}

export interface ICartItem {
  id: number;
  name: string;
  quantity: number;
  priceAtSale: number;
  totalPrice: number;
  quantityAtStore: number;
  type: string;
  oem: string | null;
  WXQP: string;
  productId: number;
  purchase_price: number;
  sale_price: number;
}

export interface ISalesSummary {
  totalIncome: number;
  totalCardIncome: number;
}
