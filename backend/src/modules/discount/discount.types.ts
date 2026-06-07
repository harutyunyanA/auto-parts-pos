import type { Optional } from "sequelize";
import type { sourceType } from "../../types/source.types.ts";

// In-memory rule shape used by the bulk-apply payload.
export type DiscountRule = {
  minProfit: number;
  maxProfit: number | null;
  discount: number;
};

// Persisted rule row (discount_rules table).
export type DiscountRuleType = {
  id: number;
  minProfit: number;
  maxProfit: number | null;
  discount: number;
  source: sourceType;
  createdAt: Date;
  updatedAt: Date;
};

export type DiscountRuleCreationType = Optional<
  DiscountRuleType,
  "id" | "createdAt" | "updatedAt"
>;
