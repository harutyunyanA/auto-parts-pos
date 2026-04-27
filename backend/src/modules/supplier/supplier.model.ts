import { DataTypes, Model } from "sequelize";
import { sequelize } from "../../config/db.ts";
import type { SupplierType, SupplierCreationType } from "./supplier.types.ts";
import { Product } from "../product/product.model.ts";

export class Supplier
  extends Model<SupplierType, SupplierCreationType>
  implements SupplierType
{
  declare id: number;
  declare name: string;
  declare phone: string | null;
  declare createdAt: Date;
  declare updatedAt: Date;
}

Supplier.init(
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
    phone: {
      type: DataTypes.STRING,
      allowNull: true,
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
    tableName: "suppliers",
    timestamps: true,
  },
);

// Associations
Supplier.hasMany(Product, { foreignKey: "supplier_id", as: "products" });
Product.belongsTo(Supplier, { foreignKey: "supplier_id", as: "supplier" });
