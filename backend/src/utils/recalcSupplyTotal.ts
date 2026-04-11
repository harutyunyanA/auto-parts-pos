import { Sequelize } from "sequelize";
import { Supply, SupplyItem } from "../modules/supply/supply.model.ts";

export async function recalcSupplyTotal(supplyId: number, transaction?: any) {
  const result = await SupplyItem.findOne({
    attributes: [[Sequelize.fn("SUM", Sequelize.col("totalCost")), "total"]],
    where: { supplyId },
    raw: true,
    transaction,
  });

  const totalCost = Number((result as any)?.total || 0);

  await Supply.update({ totalCost }, { where: { id: supplyId }, transaction });
}
