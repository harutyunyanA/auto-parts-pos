// Local row in the bulk-discount panel. `id` is a client-side key only.
export interface IDiscountRuleRow {
  id: string;
  minProfit: number | null;
  maxProfit: number | null;
  discount: number | null;
}

// Payload sent to PATCH /discounts/bulk. `maxProfit: null` means no upper bound.
export interface IBulkDiscountRule {
  minProfit: number;
  maxProfit: number | null;
  discount: number;
}

export interface ISetProductDiscountPayload {
  code: number;
  discount: number;
}

export interface IBulkDiscountResult {
  updated: number;
  total: number;
}

export interface IResetDiscountResult {
  updated: number;
}
