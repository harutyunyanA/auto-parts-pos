import { DataTypes, Model } from "sequelize";
import { sequelize } from "../../config/db.ts";
import type { SupplyType } from "./supply.types.ts";
import type { sourceType } from "../../types/source.types.ts";
import { Product } from "../product/product.model.ts";
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
    },
    minQuantity: {
      type: DataTypes.INTEGER,
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
