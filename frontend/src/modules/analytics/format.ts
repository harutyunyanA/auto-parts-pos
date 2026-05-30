// Денежные значения приходят с бэка как DECIMAL/число и могут быть дробными
// (себестоимость из USD-расчёта). В рознице показываем округлённо до целого.
export function money(value: number): string {
  return Math.round(Number(value) || 0).toLocaleString();
}
