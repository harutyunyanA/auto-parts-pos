import { DataTypes, Model } from "sequelize";
import { sequelize } from "../../config/db.ts";
import type { SupplyType } from "./supply.types.ts";
import type { sourceType } from "../../types/source.types.ts";
import { Product } from "../product/product.model.ts";
import { Supplier } from "../supplier/supplier.model.ts";
import { recalcSupplyTotal } from "../../utils/recalcSupplyTotal.ts";

// -------------------- Supply --------------------
export class Supply extends Model implements SupplyType {
  declare id: number;
  declare supplierId: number;
  declare totalCost: string | null;
  declare source: sourceType;
  declare status: "draft" | "completed";
  declare createdAt: Date;
  declare updatedAt: Date;
}

Supply.init(
  {
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true,
    },
    supplierId: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    status: {
      type: DataTypes.ENUM("draft", "completed"),
      allowNull: false,
      defaultValue: "draft",
    },
    source: {
      type: DataTypes.ENUM("soviet", "import"),
      allowNull: false,
    },
    totalCost: {
      type: DataTypes.DECIMAL(12, 2),
      allowNull: true,
      defaultValue: 0,
    },
  },
  {
    sequelize,
    tableName: "supplies",
    timestamps: true,
  },
);

// -------------------- SupplyItem --------------------
export class SupplyItem extends Model {
  declare id: number;
  declare supplyId: number;
  declare productId: number;
  declare quantity: number;
  declare purchasePrice: string;
  declare oldPurchasePrice: string;
  declare salePrice: string;
  declare oldSalePrice: string;
  declare totalCost: string;
  declare minQuantity: number | null;
  declare purchasePriceUsd: string | null;
  declare usdRate: string | null;
  declare weight: string | null;
  declare tax: string | null;
  declare createdAt: Date;
  declare updatedAt: Date;
}

SupplyItem.init(
  {
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true,
    },
    supplyId: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: "supplies",
        key: "id",
      },
    },
    productId: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: "products",
        key: "id",
      },
    },
    quantity: {
      type: DataTypes.INTEGER,
      allowNull: false,
      defaultValue: 0,
    },
    purchasePrice: {
      type: DataTypes.DECIMAL(12, 2),
      allowNull: false,
    },
    salePrice: {
      type: DataTypes.DECIMAL(12, 2),
      allowNull: true,
    },
    oldPurchasePrice: {
      type: DataTypes.DECIMAL(12, 2),
      allowNull: false,
    },
    oldSalePrice: {
      type: DataTypes.DECIMAL(12, 2),
      allowNull: true,
    },
    totalCost: {
      type: DataTypes.DECIMAL(12, 2),
      allowNull: false,
      defaultValue: 0,
    },
    minQuantity: {
      type: DataTypes.INTEGER,
      allowNull: true,
    },
    purchasePriceUsd: {
      type: DataTypes.DECIMAL(12, 2),
      allowNull: true,
    },
    usdRate: {
      type: DataTypes.DECIMAL(10, 4),
      allowNull: true,
    },
    weight: {
      type: DataTypes.DECIMAL(10, 3),
      allowNull: true,
    },
    tax: {
      type: DataTypes.DECIMAL(10, 2),
      allowNull: true,
    },
  },
  {
    sequelize,
    tableName: "supply_items",
    timestamps: true,
  },
);

// -------------------- Associations --------------------
Supply.hasMany(SupplyItem, { foreignKey: "supplyId", as: "items" });
SupplyItem.belongsTo(Supply, { foreignKey: "supplyId", as: "supply" });
SupplyItem.belongsTo(Product, { foreignKey: "productId", as: "product" });
// constraints:false — suppliers are unscoped/global and we don't want
// sync({ alter: true }) to add or duplicate a FK constraint on every boot.
Supply.belongsTo(Supplier, {
  foreignKey: "supplierId",
  as: "supplier",
  constraints: false,
});

//HOOKS
// CREATE
SupplyItem.addHook("afterCreate", async (item: SupplyItem, options) => {
  await recalcSupplyTotal(item.supplyId, options.transaction);
});

// UPDATE
SupplyItem.addHook("afterUpdate", async (item: SupplyItem, options) => {
  await recalcSupplyTotal(item.supplyId, options.transaction);
});

// DELETE
SupplyItem.addHook("afterDestroy", async (item: SupplyItem, options) => {
  await recalcSupplyTotal(item.supplyId, options.transaction);
});

// SupplyItem.addHook("beforeSave", async (item: SupplyItem, options) => {
//   await recalcSupplyItemTotal(item.supplyId, options.transaction);
// })