import { Sequelize, Op } from "sequelize";
import { sequelize } from "../config/db.ts";
import { Cart, CartItem } from "../modules/sale/sale.model.ts";

export async function normalizeCart(cartId: number) {
  const transaction = await sequelize.transaction();

  try {
    const groupedItems = await CartItem.findAll({
      attributes: [
        "productId",
        "priceAtSale",
        [Sequelize.fn("SUM", Sequelize.col("quantity")), "quantity"],
        [Sequelize.fn("SUM", Sequelize.col("totalPrice")), "totalPrice"],
      ],
      where: {
        cartId,
        quantity: { [Op.gt]: 0 },
      },
      group: ["productId", "priceAtSale"],
      raw: true,
      transaction,
    });

    await CartItem.destroy({
      where: { cartId },
      transaction,
    });

    const itemsToInsert = groupedItems.map((item: any) => ({
      cartId,
      productId: item.productId,
      priceAtSale: item.priceAtSale,
      quantity: item.quantity,
      totalPrice: item.totalPrice,
    }));

    if (itemsToInsert.length) {
      await CartItem.bulkCreate(itemsToInsert, { transaction });
    }

    const totalAmount = itemsToInsert.reduce(
      (sum, i) => sum + Number(i.totalPrice),
      0,
    );

    await Cart.update({ totalAmount }, { where: { id: cartId }, transaction });

    await transaction.commit();

    return { success: true, totalAmount, items: itemsToInsert };
  } catch (err) {
    await transaction.rollback();
    throw err;
  }
}
