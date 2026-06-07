import { Op } from "sequelize";
import type { Transaction } from "sequelize";
import { sequelize } from "../../config/db.ts";
import { Product } from "../product/product.model.ts";
import { DiscountRule } from "./discountRule.model.ts";
import { NotFoundError } from "../../utils/errors.ts";
import type { sourceType } from "../../types/source.types.ts";
import type { DiscountRule as DiscountRuleInput } from "./discount.types.ts";

// Profit %, computed relative to purchase price (matches the rest of the app).
// Returns null when purchase price is missing/zero (profit undefined).
function profitPercent(product: Product): number | null {
  const buy = Number(product.purchase_price);
  const sale = Number(product.sale_price);
  if (!(buy > 0)) return null;
  return ((sale - buy) / buy) * 100;
}

class DiscountService {
  // One-shot bulk apply: set each product's discount based on its profit %.
  // Products with no valid purchase price are skipped. The first matching rule
  // wins, so rule order matters. Rules are merged into the saved set for the
  // source (a rule with the same range updates its discount, a new range is
  // added) so they accumulate across applies rather than overwriting.
  async applyBulk(source: sourceType, rules: DiscountRuleInput[]) {
    const products = await Product.findAll({ where: { source } });

    const t = await sequelize.transaction();
    try {
      let updated = 0;

      for (const product of products) {
        const profit = profitPercent(product);
        if (profit === null) continue; // profit undefined -> skip

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

      // Merge into the saved rule set: same range -> update discount,
      // new range -> insert. Existing rules are never removed here.
      for (const r of rules) {
        const existing = await DiscountRule.findOne({
          where: { source, minProfit: r.minProfit, maxProfit: r.maxProfit },
          transaction: t,
        });
        if (existing) {
          if (Number(existing.discount) !== r.discount) {
            await existing.update({ discount: r.discount }, { transaction: t });
          }
        } else {
          await DiscountRule.create(
            {
              minProfit: r.minProfit,
              maxProfit: r.maxProfit,
              discount: r.discount,
              source,
            },
            { transaction: t },
          );
        }
      }

      await t.commit();
      return { updated, total: products.length };
    } catch (err) {
      await t.rollback();
      throw err;
    }
  }

  // List saved rules for the source.
  async getRules(source: sourceType) {
    return await DiscountRule.findAll({
      where: { source },
      order: [["id", "ASC"]],
    });
  }

  // Delete a single rule and roll back the discounts it applied: zero out the
  // discount on every product of this source whose profit falls in the rule's
  // range. (Manual discounts in that range are cleared too — there is no way to
  // tell them apart from rule-applied ones; this is intentional.)
  async deleteRule(source: sourceType, id: number) {
    const rule = await DiscountRule.findOne({ where: { id, source } });
    if (!rule) throw new NotFoundError("Discount rule not found");

    const minProfit = Number(rule.minProfit);
    const maxProfit = rule.maxProfit === null ? null : Number(rule.maxProfit);

    const t = await sequelize.transaction();
    try {
      await rule.destroy({ transaction: t });

      const cleared = await this.clearDiscountsInRange(
        source,
        minProfit,
        maxProfit,
        t,
      );

      await t.commit();
      return { cleared };
    } catch (err) {
      await t.rollback();
      throw err;
    }
  }

  // Delete all rules for the source and zero out every discount.
  async deleteAllRules(source: sourceType) {
    const t = await sequelize.transaction();
    try {
      await DiscountRule.destroy({ where: { source }, transaction: t });
      const [updated] = await Product.update(
        { discount: 0 },
        { where: { source, discount: { [Op.ne]: 0 } }, transaction: t },
      );
      await t.commit();
      return { updated };
    } catch (err) {
      await t.rollback();
      throw err;
    }
  }

  // Zero out discounts for products whose profit is within [min, max].
  private async clearDiscountsInRange(
    source: sourceType,
    minProfit: number,
    maxProfit: number | null,
    t: Transaction,
  ) {
    const products = await Product.findAll({
      where: { source, discount: { [Op.ne]: 0 } },
      transaction: t,
    });

    let cleared = 0;
    for (const product of products) {
      const profit = profitPercent(product);
      if (profit === null) continue;
      if (profit < minProfit) continue;
      if (maxProfit !== null && profit > maxProfit) continue;

      await product.update({ discount: 0 }, { transaction: t });
      cleared++;
    }
    return cleared;
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
