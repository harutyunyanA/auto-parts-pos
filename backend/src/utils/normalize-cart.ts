import { Sequelize, Op } from "sequelize";
import { sequelize } from "../config/db.ts";
import { Cart, CartItem } from "../modules/sale/sale.model.ts";

export async function normalizeCart(cartId: number, transaction?: any) {
  const t = transaction || (await sequelize.transaction());
  const ownTransaction = !transaction;

  try {
    const groupedItems = await CartItem.findAll({
      attributes: [
        "productId",
        "priceAtSale",
        [Sequelize.fn("SUM", Sequelize.col("quantity")), "quantity"],
        [Sequelize.fn("SUM", Sequelize.col("totalPrice")), "totalPrice"],
      ],
      where: { cartId, quantity: { [Op.gt]: 0 } },
      group: ["productId", "priceAtSale"],
      raw: true,
      transaction: t,
    });

    await CartItem.destroy({ where: { cartId }, transaction: t });

    const itemsToInsert = groupedItems.map((item: any) => ({
      cartId,
      productId: item.productId,
      priceAtSale: item.priceAtSale,
      quantity: item.quantity,
      totalPrice: item.totalPrice,
    }));

    if (itemsToInsert.length) {
      await CartItem.bulkCreate(itemsToInsert, { transaction: t });
    }

    const totalAmount = itemsToInsert.reduce(
      (sum, i) => sum + Number(i.totalPrice),
      0,
    );

    await Cart.update(
      { totalAmount },
      { where: { id: cartId }, transaction: t },
    );

    if (ownTransaction) await t.commit();

    return { normalized: true, totalAmount, items: itemsToInsert };
  } catch (err) {
    if (ownTransaction) await t.rollback();
    throw err;
  }
}
