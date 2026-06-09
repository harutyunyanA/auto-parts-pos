import { Op, fn, col } from "sequelize";
import dayjs from "dayjs";
import { Supply } from "../supply/supply.model.ts";
import { Cart, CartItem } from "../sale/sale.model.ts";
import { Product } from "../product/product.model.ts";
import { Supplier } from "../supplier/supplier.model.ts";
import type {
  SupplierStat,
  DeadStockItem,
} from "./analytics.types.ts";

// Строит фильтр по createdAt из необязательных from/to (YYYY-MM-DD).
// Возвращает null, если период не задан (тогда фильтра по дате нет).
function buildDateRange(from?: string, to?: string) {
  const range: Record<symbol, Date> = {};
  if (from) range[Op.gte] = dayjs(from).startOf("day").toDate();
  if (to) range[Op.lte] = dayjs(to).endOf("day").toDate();
  return Object.getOwnPropertySymbols(range).length ? range : null;
}

class AnalyticsService {
  // Статистика по каждому поставщику: закуплено / продано / себестоимость / прибыль.
  async getSupplierStats(
    from?: string,
    to?: string,
  ): Promise<SupplierStat[]> {
    const range = buildDateRange(from, to);

    // 1) Закупки — одно-табличный SUM по completed-поставкам.
    const purchases = await Supply.findAll({
      attributes: [
        "supplierId",
        [fn("SUM", col("totalCost")), "purchased"],
        [fn("COUNT", col("id")), "supplyCount"],
      ],
      where: {
        status: "completed",
        ...(range && { createdAt: range }),
      },
      group: ["supplierId"],
      raw: true,
    });

    // 2) Продажи товаров поставщиков — выборка + агрегация в JS (надёжнее
    //    кросс-табличного SUM с literal-выражениями).
    const soldItems = (await CartItem.findAll({
      attributes: ["quantity", "totalPrice", "purchasePriceAtSale"],
      include: [
        {
          model: Product,
          as: "product",
          attributes: ["supplier_id"],
          required: true,
        },
        {
          model: Cart,
          attributes: [],
          where: {
            status: "completed",
            ...(range && { createdAt: range }),
          },
          required: true,
        },
      ],
      raw: true,
    })) as any[];

    const salesMap = new Map<
      number | null,
      { sold: number; cogs: number; soldQty: number }
    >();
    for (const it of soldItems) {
      const sid = it["product.supplier_id"] ?? null;
      const cur = salesMap.get(sid) ?? { sold: 0, cogs: 0, soldQty: 0 };
      cur.sold += Number(it.totalPrice);
      cur.cogs += Number(it.purchasePriceAtSale) * Number(it.quantity);
      cur.soldQty += Number(it.quantity);
      salesMap.set(sid, cur);
    }

    // 3) Имена поставщиков + сборка по объединённому набору id.
    const suppliers = (await Supplier.findAll({
      attributes: ["id", "name"],
      raw: true,
    })) as any[];
    const nameMap = new Map<number, string>(
      suppliers.map((s) => [Number(s.id), s.name]),
    );

    const purchaseMap = new Map<number | null, any>(
      purchases.map((p: any) => [
        p.supplierId === null ? null : Number(p.supplierId),
        p,
      ]),
    );

    const ids = new Set<number | null>([
      ...purchaseMap.keys(),
      ...salesMap.keys(),
    ]);

    const result: SupplierStat[] = [...ids].map((id) => {
      const p = purchaseMap.get(id);
      const s = salesMap.get(id);
      const sold = s?.sold ?? 0;
      const cogs = s?.cogs ?? 0;
      return {
        supplierId: id,
        name: id === null ? "—" : (nameMap.get(id) ?? `#${id}`),
        purchased: Number(p?.purchased ?? 0),
        supplyCount: Number(p?.supplyCount ?? 0),
        sold,
        cogs,
        profit: sold - cogs,
        soldQty: s?.soldQty ?? 0,
      };
    });

    result.sort((a, b) => b.purchased - a.purchased);
    return result;
  }

  // Мёртвый сток: товары с остатком, не продававшиеся за последние N дней.
  async getDeadStock(days = 90): Promise<DeadStockItem[]> {
    const since = dayjs().subtract(days, "day").startOf("day").toDate();

    // productId, у которых были продажи за период.
    const soldRows = (await CartItem.findAll({
      attributes: ["productId"],
      include: [
        {
          model: Cart,
          attributes: [],
          where: { status: "completed", createdAt: { [Op.gte]: since } },
          required: true,
        },
      ],
      group: ["productId"],
      raw: true,
    })) as any[];

    const soldIds = soldRows.map((r) => Number(r.productId));

    const where: any = { quantity: { [Op.gt]: 0 } };
    if (soldIds.length) where.id = { [Op.notIn]: soldIds };

    const products = (await Product.findAll({
      where,
      attributes: [
        "id",
        "name",
        "type",
        "oem",
        "quantity",
        "purchase_price",
        "sale_price",
      ],
      raw: true,
    })) as any[];

    const result: DeadStockItem[] = products.map((p) => ({
      id: Number(p.id),
      name: p.name,
      type: p.type,
      oem: p.oem,
      quantity: Number(p.quantity),
      purchase_price: Number(p.purchase_price),
      sale_price: Number(p.sale_price),
      frozenValue: Number(p.quantity) * Number(p.purchase_price),
    }));

    result.sort((a, b) => b.frozenValue - a.frozenValue);
    return result;
  }
}

export default new AnalyticsService();
