import { DataTypes, Model } from "sequelize";
import { sequelize } from "../../config/db.ts";

export class CashDesk extends Model {
  declare id: number;
  declare name: string;
  declare active: boolean;
  declare createdAt: Date;
  declare updatedAt: Date;
}

CashDesk.init(
  {
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true,
    },
    name: {
      type: DataTypes.STRING(64),
      allowNull: false,
    },
    active: {
      type: DataTypes.BOOLEAN,
      allowNull: false,
      defaultValue: true,
    },
  },
  {
    sequelize,
    tableName: "cash_desks",
    timestamps: true,
    // Named index — never `unique: true` on the column, that duplicates the
    // index on every sync({ alter: true }) boot.
    indexes: [
      { name: "cash_desks_name_unique", unique: true, fields: ["name"] },
    ],
  },
);
