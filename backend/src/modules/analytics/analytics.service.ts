import { Op, fn, col } from "sequelize";
import dayjs from "dayjs";
import type { sourceType } from "../../types/source.types.ts";
import { Supply } from "../supply/supply.model.ts";
import { Cart, CartItem } from "../sale/sale.model.ts";
import { Product } from "../product/product.model.ts";
import { Supplier } from "../supplier/supplier.model.ts";
import type {
  SupplierStat,
  TopProduct,
  TopProductsSort,
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
    source: sourceType,
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
        source,
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
          where: { source },
          required: true,
        },
        {
          model: Cart,
          attributes: [],
          where: {
            source,
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

  // Топ проданных товаров по штукам или по выручке.
  async getTopProducts(
    source: sourceType,
    from?: string,
    to?: string,
    by: TopProductsSort = "qty",
    limit = 20,
  ): Promise<TopProduct[]> {
    const range = buildDateRange(from, to);

    const items = (await CartItem.findAll({
      attributes: ["productId", "quantity", "totalPrice", "purchasePriceAtSale"],
      include: [
        {
          model: Product,
          as: "product",
          attributes: ["name", "code", "oem", "type"],
          where: { source },
          required: true,
        },
        {
          model: Cart,
          attributes: [],
          where: {
            source,
            status: "completed",
            ...(range && { createdAt: range }),
          },
          required: true,
        },
      ],
      raw: true,
    })) as any[];

    const map = new Map<number, TopProduct>();
    for (const it of items) {
      const id = Number(it.productId);
      const cur =
        map.get(id) ??
        ({
          productId: id,
          name: it["product.name"],
          code: it["product.code"],
          oem: it["product.oem"],
          type: it["product.type"],
          qtySold: 0,
          revenue: 0,
          cogs: 0,
          profit: 0,
        } as TopProduct);
      cur.qtySold += Number(it.quantity);
      cur.revenue += Number(it.totalPrice);
      cur.cogs += Number(it.purchasePriceAtSale) * Number(it.quantity);
      cur.profit = cur.revenue - cur.cogs;
      map.set(id, cur);
    }

    const arr = [...map.values()];
    arr.sort((a, b) =>
      by === "revenue" ? b.revenue - a.revenue : b.qtySold - a.qtySold,
    );
    return arr.slice(0, limit);
  }

  // Мёртвый сток: товары с остатком, не продававшиеся за последние N дней.
  async getDeadStock(
    source: sourceType,
    days = 90,
  ): Promise<DeadStockItem[]> {
    const since = dayjs().subtract(days, "day").startOf("day").toDate();

    // productId, у которых были продажи за период (в этой кассе).
    const soldRows = (await CartItem.findAll({
      attributes: ["productId"],
      include: [
        {
          model: Cart,
          attributes: [],
          where: { source, status: "completed", createdAt: { [Op.gte]: since } },
          required: true,
        },
      ],
      group: ["productId"],
      raw: true,
    })) as any[];

    const soldIds = soldRows.map((r) => Number(r.productId));

    const where: any = { source, quantity: { [Op.gt]: 0 } };
    if (soldIds.length) where.id = { [Op.notIn]: soldIds };

    const products = (await Product.findAll({
      where,
      attributes: [
        "id",
        "code",
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
      code: p.code,
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
