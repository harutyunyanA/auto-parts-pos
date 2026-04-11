import { success } from "zod";
import { sequelize } from "../../config/db.ts";
import { Product } from "../product/product.model.ts";
// import productService from "../product/product.service.ts";
// import type { ProductType } from "../product/product.types.ts";
import { Supply, SupplyItem } from "./supply.model.ts";
import type { SupplyItemType, SupplyType } from "./supply.types.ts";

class SupplyService {
  async createSupply(supplierId: number, source: string) {
    const newSupply = (await Supply.create({ supplierId, source })).toJSON();
    if (!newSupply) {
      throw new Error("Cannot create new SUPPLY");
    }
    return newSupply;
  }

  async updateSupplier(supplyId: number, supplierId: number) {
    const result = await Supply.findByPk(supplyId);
    if (!result) {
      throw new Error("Supply not found");
    }
    const supply: SupplyType = result.dataValues;

    if (supply.status === "completed") {
      throw new Error(
        "Supply status completed. Open supply record before any changes",
      );
    }

    result.supplierId = supplierId;
    result.save();

    return result.dataValues;
  }

  async addSupplyItem(supplyId: number, supply: SupplyItemType) {
    const transaction = await sequelize.transaction();

    try {
      // Проверяем продукт
      const product = await Product.findByPk(supply.productId, { transaction });
      if (!product) {
        throw new Error("Product not found");
      }

      // Создаём SupplyItem
      const newSupplyItem = await SupplyItem.create(
        {
          supplyId,
          ...supply,
          oldPurchasePrice: product.purchase_price,
          oldSalePrice: product.sale_price,
          totalCost: supply.quantity * supply.purchasePrice,
        },
        { transaction },
      );

      // Обновляем продукт
      product.purchase_price = supply.purchasePrice ?? product.purchase_price;
      product.sale_price = supply.salePrice ?? product.sale_price;
      product.minimum_quantity = supply.minQuantity ?? product.minimum_quantity;

      product.quantity += supply.quantity;

      await product.save({ transaction });

      // Коммитим транзакцию
      await transaction.commit();

      return { supplyItem: newSupplyItem.toJSON(), product: product.toJSON() };
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

      if (!supplyItem) throw new Error("Supply item not found");
      const supply = supplyItem.get("supply") as Supply;
      const product = supplyItem.get("product") as Product;

      if (!supply) throw new Error("Supply not found");
      if (!product) throw new Error("Product not found");

      if (supply.status === "completed") {
        throw new Error(
          "Supply status completed. Open supply record before any changes",
        );
      }

      // Откат количества и цен
      product.quantity = Math.max(product.quantity - supplyItem.quantity, 0);
      product.purchase_price =
        supplyItem.oldPurchasePrice !== null
          ? Number(supplyItem.oldPurchasePrice)
          : product.purchase_price;
      product.sale_price =
        supplyItem.oldSalePrice !== null
          ? Number(supplyItem.oldSalePrice)
          : product.sale_price;

      // Сохраняем продукт и удаляем supplyItem
      await product.save({ transaction });
      await supplyItem.destroy({ transaction });

      // Коммитим транзакцию
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
      minQuantity?: number;
    },
  ) {
    const transaction = await sequelize.transaction();

    try {
      // Находим SupplyItem сразу с Supply и Product
      const supplyItem = await SupplyItem.findOne({
        where: { id: itemId, supplyId },
        include: [
          { model: Supply, as: "supply", attributes: ["id", "status"] },
          { model: Product, as: "product" },
        ],
        transaction,
      });

      if (!supplyItem) throw new Error("Supply item not found");

      const supply = supplyItem.get("supply") as Supply;
      const product = supplyItem.get("product") as Product;

      if (supply.status === "completed") {
        throw new Error("Cannot update item in a completed supply");
      }

      // Сохраняем старые цены на случай отката
      supplyItem.oldPurchasePrice = supplyItem.purchasePrice;
      supplyItem.oldSalePrice = supplyItem.salePrice;

      // Корректируем количество на продукте
      if (data.quantity !== undefined) {
        // убираем старое количество, добавляем новое
        product.quantity =
          product.quantity - supplyItem.quantity + data.quantity;
        supplyItem.quantity = data.quantity;
      }

      if (data.purchasePrice !== undefined) {
        product.purchase_price = data.purchasePrice;
        supplyItem.purchasePrice = String(data.purchasePrice);
      }

      if (data.salePrice !== undefined) {
        product.sale_price = data.salePrice;
        supplyItem.salePrice = String(data.salePrice);
      }

      if (data.minQuantity !== undefined) {
        product.minimum_quantity = data.minQuantity;
        supplyItem.minQuantity = data.minQuantity;
      }

      const totalCost = Number(supplyItem.purchasePrice) * supplyItem.quantity;
      supplyItem.totalCost = String(totalCost);

      // Сохраняем изменения
      await product.save({ transaction });
      await supplyItem.save({ transaction });

      await transaction.commit();

      return supplyItem.toJSON();
    } catch (err) {
      await transaction.rollback();
      throw err;
    }
  }

  async completeSupply(supplyId: number) {
    const supply = (await Supply.findByPk(supplyId)) as Supply;
    if (!supply) {
      throw new Error("Supply not found");
    }
    if (supply.status === "completed") {
      throw new Error("Supply already completed");
    } else {
      supply.status = "completed";

      await supply.save();
    }

    return { succes: true, data: supply.toJSON() };
  }

  async getAllSupplies() {
    const supplies = await Supply.findAll();
    if (!supplies) {
      throw new Error("Supplies not found");
    }
    return { succes: true, data: { supplies } };
  }

  async getSupplyInfo(supplyId: number) {
    const supply = (
      await Supply.findByPk(supplyId, {
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
      throw new Error("Supply is not found");
    }

    return { success: true, data: supply };
  }
}

export default new SupplyService();
