import { DataTypes, Model } from "sequelize";
import { sequelize } from "../../config/db.ts";

export class Setting extends Model {
  declare id: number;
  declare key: string;
  declare value: string;
  declare createdAt: Date;
  declare updatedAt: Date;
}

Setting.init(
  {
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true,
    },
    key: {
      type: DataTypes.STRING(64),
      allowNull: false,
    },
    value: {
      type: DataTypes.STRING(255),
      allowNull: false,
    },
  },
  {
    sequelize,
    tableName: "settings",
    timestamps: true,
    indexes: [
      { name: "settings_key_unique", unique: true, fields: ["key"] },
    ],
  },
);
