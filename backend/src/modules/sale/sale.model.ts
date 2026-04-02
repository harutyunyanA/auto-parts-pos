import { DataTypes, Model } from "sequelize";
import type { CartType, SaleItemType } from "./sale.types.ts";
import { sequelize } from "../../config/db.ts";

export class Cart extends Model implements CartType {
  declare id: number;
  declare status: "draft" | "completed";
  declare totalAmount: number;
  declare paymentMethod: "cash" | "card";
  declare createdAt: Date;
  declare updatedAt: Date;
}

Cart.init(
  {
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true,
    },
    status: {
      type: DataTypes.ENUM("draft", "completed"),
      allowNull: false,
      defaultValue: "draft",
    },
    totalAmount: {
      type: DataTypes.INTEGER,
      allowNull: false,
      defaultValue: 0,
    },
    paymentMethod: {
      type: DataTypes.ENUM("cash", "card"),
      allowNull: false,
      defaultValue: "cash",
    },
  },
  {
    sequelize,
    tableName: "sales",
    timestamps: true,
  },
);

export class SaleItem extends Model implements SaleItemType {
  declare id: number;
  declare cartId: number;
  declare productId: number;
  declare quantity: number;
  declare priceAtSale: number;
  declare totalPrice: number;
}

SaleItem.init(
  {
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true,
    },
    cartId: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    productId: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    quantity: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    priceAtSale: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    totalPrice: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
  },
  {
    sequelize,
    tableName: "sale_items",
    timestamps: false,
    indexes: [
      {
        unique: true,
        fields: ["cartId", "productId"],
      },
      { fields: ["cartId"] },
      { fields: ["productId"] },
    ],
  },
);
