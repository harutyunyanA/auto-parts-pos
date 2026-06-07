import { DataTypes, Model } from "sequelize";
import { sequelize } from "../../config/db.ts";
import type { sourceType } from "../../types/source.types.ts";
import type {
  DiscountRuleType,
  DiscountRuleCreationType,
} from "./discount.types.ts";

export class DiscountRule
  extends Model<DiscountRuleType, DiscountRuleCreationType>
  implements DiscountRuleType
{
  declare id: number;
  declare minProfit: number;
  declare maxProfit: number | null;
  declare discount: number;
  declare source: sourceType;
  declare createdAt: Date;
  declare updatedAt: Date;
}

DiscountRule.init(
  {
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true,
    },

    minProfit: {
      type: DataTypes.DECIMAL(7, 2),
      allowNull: false,
    },

    // null = no upper bound
    maxProfit: {
      type: DataTypes.DECIMAL(7, 2),
      allowNull: true,
    },

    discount: {
      type: DataTypes.DECIMAL(5, 2),
      allowNull: false,
    },

    source: {
      type: DataTypes.ENUM("soviet", "import"),
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
    tableName: "discount_rules",
    timestamps: true,
  },
);
