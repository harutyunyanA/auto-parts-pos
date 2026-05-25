export function recalcSupplyItemTax(
  basePrice: number,
  tax: number,
  rate: number,
  weight: number,
) {
  return basePrice + tax * rate * weight;
}
