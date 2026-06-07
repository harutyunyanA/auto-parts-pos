import { Op } from "sequelize";
import { sequelize } from "../../config/db.ts";
import { Product } from "../product/product.model.ts";
import type { sourceType } from "../../types/source.types.ts";
import type { DiscountRule } from "./discount.types.ts";

class DiscountService {
  // One-shot bulk apply: set each product's discount based on its profit %
  // (computed relative to purchase price). Products with no valid purchase
  // price have an undefined profit and are skipped. The first matching rule
  // wins, so rule order matters.
  async applyBulk(source: sourceType, rules: DiscountRule[]) {
    const products = await Product.findAll({ where: { source } });

    const t = await sequelize.transaction();
    try {
      let updated = 0;

      for (const product of products) {
        const buy = Number(product.purchase_price);
        const sale = Number(product.sale_price);
        if (!(buy > 0)) continue; // profit undefined -> skip

        const profit = ((sale - buy) / buy) * 100;
        const rule = rules.find(
          (r) =>
            profit >= r.minProfit &&
            (r.maxProfit === null || profit <= r.maxProfit),
        );
        if (!rule) continue;

        if (Number(product.discount) !== rule.discount) {
          await product.update({ discount: rule.discount }, { transaction: t });
          updated++;
        }
      }

      await t.commit();
      return { updated, total: products.length };
    } catch (err) {
      await t.rollback();
      throw err;
    }
  }

  // Zero out every discount for the given source.
  async resetAll(source: sourceType) {
    const [updated] = await Product.update(
      { discount: 0 },
      { where: { source, discount: { [Op.ne]: 0 } } },
    );
    return { updated };
  }
}

export default new DiscountService();
