import { Sequelize } from "sequelize";
import { Cart, CartItem } from "../modules/sale/sale.model.ts";

export async function recalcCartTotal(cartId: number, transaction?: any) {
  const result = await CartItem.findOne({
    attributes: [[Sequelize.fn("SUM", Sequelize.col("totalPrice")), "total"]],
    where: { cartId },
    raw: true,
    transaction,
  });

  const totalAmount = Number((result as any)?.total || 0);

  await Cart.update({ totalAmount }, { where: { id: cartId }, transaction });
}
