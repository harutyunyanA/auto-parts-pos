import { success } from "zod";
import { sequelize } from "../../config/db.ts";
import { Product } from "../product/product.model.ts";
// import productService from "../product/product.service.ts";
// import type { ProductType } from "../product/product.types.ts";
import { Supply, SupplyItem } from "./supply.model.ts";
import type { SupplyItemType, SupplyType } from "./supply.types.ts";
import { NotFoundError, BadRequestError } from "../../utils/errors.ts";
import type { sourceType } from "../../types/source.types.ts";
import settingsService from "../settings/settings.service.ts";
import {
  DEFAULT_USD_RATE_KEY,
  DEFAULT_TAX_KEY,
} from "../settings/settings.types.ts";

class SupplyService {
  async createSupply(supplierId: number, source: string) {
    const newSupply = await Supply.create({
      supplierId,
      source,
    });

    if (!newSupply) {
      throw new BadRequestError("Cannot create new SUPPLY");
    }

    return newSupply.toJSON();
  }

  async updateSupplier(supplyId: number, supplierId: number) {
    const result = await Supply.findByPk(supplyId);
    if (!result) {
      throw new NotFoundError("Supply not found");
    }
    const supply: SupplyType = result.dataValues;

    if (supply.status === "completed") {
      throw new BadRequestError(
        "Supply status completed. Open supply record before any changes",
      );
    }

    result.supplierId = supplierId;
    result.save();

    return result.dataValues;
  }

  async addSupplyItem(code: number, supplyId: number, source: sourceType) {
    const transaction = await sequelize.transaction();

    try {
      const product = await Product.findOne({
        where: { code: code, source },
        transaction,
      });

      if (!product) {
        throw new NotFoundError("Product not found");
      }

      const supply = await Supply.findByPk(supplyId);
      if (!supply) {
        throw new NotFoundError("Supply not found");
      }

      if (supply.status === "completed") {
        throw new BadRequestError("Supply is completed");
      }

      const [defaultUsdRate, defaultTax] = await Promise.all([
        settingsService.getNumber(DEFAULT_USD_RATE_KEY),
        settingsService.getNumber(DEFAULT_TAX_KEY),
      ]);

      const supplyItem = await SupplyItem.create(
        {
          supplyId,
          productId: product.id,
          purchasePrice: product.purchase_price,
          salePrice: product.sale_price,
          oldPurchasePrice: product.purchase_price,
          oldSalePrice: product.sale_price,
          quantity: 0,
          totalCost: 0,
          purchasePriceUsd: null,
          usdRate: defaultUsdRate,
          weight: product.weight,
          tax: defaultTax,
          createdAt: supply.createdAt,
          updatedAt: supply.updatedAt,
        },
        { transaction },
      );

      await transaction.commit();
      return supplyItem.toJSON();
    } catch (err) {
      await transaction.rollback();
      throw err;
    }
  }

  async deleteSupplyItem(supplyId: number, itemId: number) {
    const transaction = await sequelize.transaction();

    try {
      const supplyItem = await SupplyItem.findOne({
        where: { id: itemId, supplyId },
        include: [
          {
            model: Supply,
            as: "supply",
            attributes: ["id", "status"],
          },
          {
            model: Product,
            as: "product",
          },
        ],
        transaction,
      });

      if (!supplyItem) throw new NotFoundError("Supply item not found");
      const supply = supplyItem.get("supply") as Supply;
      const product = supplyItem.get("product") as Product;

      if (!supply) throw new NotFoundError("Supply not found");
      if (!product) throw new NotFoundError("Product not found");

      if (supply.status === "completed") {
        throw new BadRequestError(
          "Supply status completed. Open supply record before any changes",
        );
      }

      product.quantity = Math.max(product.quantity - supplyItem.quantity, 0);
      product.purchase_price =
        supplyItem.oldPurchasePrice !== null
          ? Number(supplyItem.oldPurchasePrice)
          : product.purchase_price;
      product.sale_price =
        supplyItem.oldSalePrice !== null
          ? Number(supplyItem.oldSalePrice)
          : product.sale_price;

      await product.save({ transaction });
      await supplyItem.destroy({ transaction });

      await transaction.commit();

      return { success: true };
    } catch (err) {
      await transaction.rollback();
      throw err;
    }
  }

  async updateSupplyItem(
    supplyId: number,
    itemId: number,
    data: {
      quantity?: number;
      purchasePrice?: number;
      salePrice?: number;
      minQuantity?: number | null;
      purchasePriceUsd?: number | null;
      usdRate?: number | null;
      weight?: number | null;
      tax?: number | null;
    },
  ) {
    const transaction = await sequelize.transaction();

    try {
      const supplyItem = await SupplyItem.findOne({
        where: { id: itemId, supplyId },
        include: [
          { model: Supply, as: "supply", attributes: ["id", "status"] },
          { model: Product, as: "product" },
        ],
        transaction,
      });

      if (!supplyItem) throw new NotFoundError("Supply item not found");

      const supply = supplyItem.get("supply") as Supply;
      const product = supplyItem.get("product") as Product;

      if (supply.status === "completed") {
        throw new BadRequestError("Cannot update item in a completed supply");
      }

      const recalcFromUsd = () => {
        const usd = Number(supplyItem.purchasePriceUsd);
        const rate = Number(supplyItem.usdRate);
        const tax = Number(supplyItem.tax ?? 0);
        const weight = Number(supplyItem.weight ?? 0);
        const newPrice = (usd + weight * tax) * rate;
        supplyItem.purchasePrice = String(newPrice);
        product.purchase_price = newPrice;
      };

      const canRecalc = () =>
        supplyItem.purchasePriceUsd !== null && supplyItem.usdRate !== null;

      if (data.quantity !== undefined) {
        product.quantity =
          product.quantity - supplyItem.quantity + data.quantity;
        supplyItem.quantity = data.quantity;
      }

      if (data.purchasePrice !== undefined) {
        product.purchase_price = data.purchasePrice;
        supplyItem.purchasePrice = String(data.purchasePrice);
        supplyItem.purchasePriceUsd = null;
      }

      if (data.salePrice !== undefined) {
        product.sale_price = data.salePrice;
        supplyItem.salePrice = String(data.salePrice);
      }

      if (data.minQuantity !== undefined) {
        product.minimum_quantity = data.minQuantity;
        supplyItem.minQuantity = data.minQuantity;
      }

      if (data.purchasePriceUsd !== undefined) {
        supplyItem.purchasePriceUsd =
          data.purchasePriceUsd === null ? null : String(data.purchasePriceUsd);
        if (canRecalc()) recalcFromUsd();
      }

      if (data.usdRate !== undefined) {
        supplyItem.usdRate =
          data.usdRate === null ? null : String(data.usdRate);
        if (canRecalc()) recalcFromUsd();
      }

      if (data.tax !== undefined) {
        if (supplyItem.purchasePriceUsd === null) {
          throw new BadRequestError(
            "Cannot set tax without purchasePriceUsd",
          );
        }
        supplyItem.tax = data.tax === null ? null : String(data.tax);
        if (canRecalc()) recalcFromUsd();
      }

      if (data.weight !== undefined) {
        if (supplyItem.purchasePriceUsd === null) {
          throw new BadRequestError(
            "Cannot set weight without purchasePriceUsd",
          );
        }
        product.weight = data.weight;
        supplyItem.weight = data.weight === null ? null : String(data.weight);
        if (canRecalc()) recalcFromUsd();
      }

      const totalCost = Number(supplyItem.purchasePrice) * supplyItem.quantity;
      supplyItem.totalCost = String(totalCost);

      await product.save({ transaction });
      await supplyItem.save({ transaction });

      await transaction.commit();

      return supplyItem.toJSON();
    } catch (err) {
      await transaction.rollback();
      throw err;
    }
  }

  async updateItemQuantity(supplyId: number, itemId: number, quantity: number) {
    const transaction = await sequelize.transaction();
    try {
      const item = await SupplyItem.findOne({
        where: { id: itemId, supplyId },
        include: [
          { model: Supply, as: "supply", attributes: ["status"] },
          { model: Product, as: "product" },
        ],
        transaction,
      });

      if (!item) throw new NotFoundError("Supply item not found");
      const supply = item.get("supply") as Supply;
      if (supply.status === "completed")
        throw new BadRequestError("Supply completed");

      const product = item.get("product") as Product;
      product.quantity = product.quantity - item.quantity + quantity;
      item.quantity = quantity;
      item.totalCost = String(Number(item.purchasePrice) * quantity);

      await product.save({ transaction });
      await item.save({ transaction });
      await transaction.commit();
      return item.toJSON();
    } catch (err) {
      await transaction.rollback();
      throw err;
    }
  }

  async updateItemPurchasePrice(
    supplyId: number,
    itemId: number,
    purchasePrice: number,
  ) {
    const transaction = await sequelize.transaction();
    try {
      const item = await SupplyItem.findOne({
        where: { id: itemId, supplyId },
        include: [
          { model: Supply, as: "supply", attributes: ["status"] },
          { model: Product, as: "product" },
        ],
        transaction,
      });

      if (!item) throw new NotFoundError("Supply item not found");
      const supply = item.get("supply") as Supply;
      if (supply.status === "completed")
        throw new BadRequestError("Supply completed");

      const product = item.get("product") as Product;
      product.purchase_price = purchasePrice;
      item.purchasePrice = String(purchasePrice);
      item.totalCost = String(purchasePrice * item.quantity);

      await product.save({ transaction });
      await item.save({ transaction });
      await transaction.commit();
      return item.toJSON();
    } catch (err) {
      await transaction.rollback();
      throw err;
    }
  }

  async updateItemSalePrice(
    supplyId: number,
    itemId: number,
    salePrice: number,
  ) {
    const transaction = await sequelize.transaction();
    try {
      const item = await SupplyItem.findOne({
        where: { id: itemId, supplyId },
        include: [
          { model: Supply, as: "supply", attributes: ["status"] },
          { model: Product, as: "product" },
        ],
        transaction,
      });

      if (!item) throw new NotFoundError("Supply item not found");
      const supply = item.get("supply") as Supply;
      if (supply.status === "completed")
        throw new BadRequestError("Supply completed");

      const product = item.get("product") as Product;
      product.sale_price = salePrice;
      item.salePrice = String(salePrice);

      await product.save({ transaction });
      await item.save({ transaction });
      await transaction.commit();
      return item.toJSON();
    } catch (err) {
      await transaction.rollback();
      throw err;
    }
  }

  async updateItemMinQuantity(
    supplyId: number,
    itemId: number,
    minQuantity: number | null,
  ) {
    const transaction = await sequelize.transaction();
    try {
      const item = await SupplyItem.findOne({
        where: { id: itemId, supplyId },
        include: [
          { model: Supply, as: "supply", attributes: ["status"] },
          { model: Product, as: "product" },
        ],
        transaction,
      });

      if (!item) throw new NotFoundError("Supply item not found");
      const supply = item.get("supply") as Supply;
      if (supply.status === "completed")
        throw new BadRequestError("Supply completed");

      const product = item.get("product") as Product;
      product.minimum_quantity = minQuantity;
      item.minQuantity = minQuantity;

      await product.save({ transaction });
      await item.save({ transaction });
      await transaction.commit();
      return item.toJSON();
    } catch (err) {
      await transaction.rollback();
      throw err;
    }
  }

  async supplyStatusToggle(supplyId: number) {
    const supply = (await Supply.findByPk(supplyId)) as Supply;
    if (!supply) {
      throw new NotFoundError("Supply not found");
    }
    if (supply.status === "completed") {
      supply.status = "draft";
    } else {
      supply.status = "completed";
    }

    await supply.save();
    return { success: true, data: supply };
  }

  async getAllSupplies(source: sourceType) {
    const supplies = await Supply.findAll({
      where: { source },
      include: [
        {
          model: SupplyItem,
          as: "items",
          attributes: {
            exclude: [
              "supplyId",
              "oldPurchasePrice",
              "oldSalePrice",
              "supplyId",
              "totalCost",
            ],
          },
          include: [
            {
              model: Product,
              as: "product",
              attributes: [
                "name",
                "quantity",
                "type",
                "code",
                "minimum_quantity",
              ],
            },
          ],
        },
      ],
    });
    if (!supplies) {
      throw new NotFoundError("Supplies not found");
    }
    // const result = supplies.map((s) => ({...s, items: s.items.map(i => )}));

    return { success: true, supplies };
  }

  async getSupplyInfo(supplyId: number, source: sourceType) {
    const supply = (
      await Supply.findOne({
        where: { id: supplyId, source },
        include: [
          {
            model: SupplyItem,
            as: "items",
            include: [
              {
                model: Product,
                as: "product",
              },
            ],
          },
        ],
      })
    )?.toJSON();

    if (!supply) {
      throw new NotFoundError("Supply is not found");
    }

    return { success: true, data: supply };
  }
}

export default new SupplyService();
