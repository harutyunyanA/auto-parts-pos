import { DataTypes, Model } from "sequelize";
import { sequelize } from "../../config/db.ts";
import type {
  ProductAttributes,
  ProductCreationAttributes,
} from "./product.types.ts";
import type { sourceType } from "../../types/source.types.ts";

export class Product
  extends Model<ProductAttributes, ProductCreationAttributes>
  implements ProductAttributes
{
  declare id: number;
  declare name: string;
  declare type: string;
  declare serial_number: string | null;
  declare WXQP: string | null;
  declare code: number;
  declare source: sourceType
  declare quantity: number;
  declare minimum_quantity: number | null;
  declare purchase_price: number;
  declare sale_price: number;
  declare supplier_id: number;
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
      allowNull: false,
      defaultValue: "-",
    },

    serial_number: {
      type: DataTypes.STRING,
      allowNull: true,
    },

    WXQP: {
      type: DataTypes.STRING,
      allowNull: true,
    },

    code: {
      type: DataTypes.INTEGER,
      allowNull: true,
    },

    source: {
      type: DataTypes.ENUM("soviet", "import"),
      allowNull: false,
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

    supplier_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
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

Product.afterCreate(async (product) => {
  if (!product.code) {
    await product.update({ code: product.id });
  }
});
