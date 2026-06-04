import { DataTypes, Model } from "sequelize";
import { sequelize } from "../../config/db.ts";
import type { ClientType, ClientCreationType } from "./clients.types.ts";

export class Client
  extends Model<ClientType, ClientCreationType>
  implements ClientType
{
  declare id: number;
  declare name: string;
  declare phone: string | null;
  declare createdAt: Date;
  declare updatedAt: Date;
}

Client.init(
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
    tableName: "clients",
    timestamps: true,
  },
);
