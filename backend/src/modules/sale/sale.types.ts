export type CartType = {
  id: number;
  status: "draft" | "completed";
  totalAmount: number;
  paymentMethod: "cash" | "card";
  createdAt: Date;
  updatedAt: Date;
};

export type SaleItemType = {
  id: number;
  cartId: number;
  productId: number;
  quantity: number;
  priceAtSale: number;
  totalPrice: number;
};
