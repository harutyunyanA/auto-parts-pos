export interface ICart {
  id: number;
  //   clientId: number;
  //   clientName: string;
  totalAmount: number;
  status: "draft" | "completed";
  //   totalItems: number;
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
  serialNumber: string;
  WXQP: string;
  code: number;
  purchase_price: number;
  sale_price: number;
}

export interface ISalesSummary {
  totalIncome: number;
  totalCardIncome: number;
}
