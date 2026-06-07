// Discount % derived from the original list price vs the (possibly reduced)
// sale price snapshot. Returns 0 when there is no reduction.
// Single source of truth shared by the live cart table and the print builder.
export function discountPct(record: {
  sale_price: number;
  priceAtSale: number;
}): number {
  const orig = Number(record.sale_price);
  const final = Number(record.priceAtSale);
  if (!(orig > 0) || final >= orig) return 0;
  return Math.round((1 - final / orig) * 100);
}
