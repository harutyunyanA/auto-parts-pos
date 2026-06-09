import { DataTypes, Model } from "sequelize";
import { sequelize } from "../../config/db.ts";
import type { ProductType, ProductCreationType } from "./product.types.ts";

export class Product
  extends Model<ProductType, ProductCreationType>
  implements ProductType
{
  declare id: number;
  declare name: string;
  declare type: string;
  declare oem: string | null;
  declare WXQP: string | null;
  declare quantity: number;
  declare minimum_quantity: number | null;
  declare purchase_price: number;
  declare sale_price: number;
  declare discount: number;
  declare weight: number | null;
  declare supplier_id: number | null;
  declare createdAt: Date;
  declare updatedAt: Date;
}

Product.init(
  {
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true,
    },

    name: {
      type: DataTypes.STRING,
      allowNull: false,
    },

    type: {
      type: DataTypes.STRING,
      allowNull: true,
      defaultValue: "-",
    },

    oem: {
      type: DataTypes.STRING,
      allowNull: true,
      defaultValue: null,
    },

    WXQP: {
      type: DataTypes.STRING,
      allowNull: true,
      defaultValue: null,
    },

    quantity: {
      type: DataTypes.INTEGER,
      allowNull: false,
      defaultValue: 0,
    },

    minimum_quantity: {
      type: DataTypes.INTEGER,
      allowNull: true,
    },

    purchase_price: {
      type: DataTypes.FLOAT,
      allowNull: false,
      defaultValue: 0,
    },

    sale_price: {
      type: DataTypes.FLOAT,
      allowNull: false,
      defaultValue: 0,
    },

    discount: {
      type: DataTypes.DECIMAL(5, 2),
      allowNull: false,
      defaultValue: 0,
    },

    supplier_id: {
      type: DataTypes.INTEGER,
      allowNull: true,
      // No default supplier: a fresh v2 DB has no suppliers yet, and the FK to
      // `suppliers` would reject a hardcoded id. null = "no supplier" (analytics
      // already renders these as "—").
      defaultValue: null,
    },

    createdAt: {
      type: DataTypes.DATE,
      allowNull: false,
    },

    updatedAt: {
      type: DataTypes.DATE,
      allowNull: false,
    },
  },
  {
    sequelize,
    tableName: "products",
    timestamps: true,
  },
);

