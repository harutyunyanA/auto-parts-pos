export type SaleType = {
  id: number;
  status: "draft" | "completed";
  totalAmount: number;
  paymentMethod: "cash" | "card";
  createdAt: Date;
  updatedAt: Date;
};

export type SaleItemType = {
  id: number;
  saleId: number;
  productId: number;
  quantity: number;
  priceAtSale: number;
  totalPrice: number;
};