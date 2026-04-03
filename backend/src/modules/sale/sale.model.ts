import { DataTypes, Model } from "sequelize";
import type { CartType, CartItemType } from "./sale.types.ts";
import { sequelize } from "../../config/db.ts";
import { Product } from "../product/product.model.ts";
import { recalcCartTotal } from "../../utils/recalcCartTotal.ts";

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

export class CartItem extends Model implements CartItemType {
  declare id: number;
  declare cartId: number;
  declare productId: number;
  declare quantity: number;
  declare priceAtSale: number;
  declare totalPrice: number;
}

CartItem.init(
  {
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true,
    },
    cartId: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: "sales",
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
    priceAtSale: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    totalPrice: {
      type: DataTypes.INTEGER,
      allowNull: false,
      defaultValue: 0,
    },
  },

  {
    sequelize,
    tableName: "sale_items",
    timestamps: false,
  },
);

Cart.hasMany(CartItem, {
  foreignKey: "cartId",
  as: "items",
});

CartItem.belongsTo(Cart, {
  foreignKey: "cartId",
});

CartItem.belongsTo(Product, {
  foreignKey: "productId",
  as: "product",
});

Product.hasMany(CartItem, {
  foreignKey: "productId",
});

// CREATE
CartItem.addHook("afterCreate", async (item: CartItem, options) => {
  await recalcCartTotal(item.cartId, options.transaction);
});

// UPDATE
CartItem.addHook("afterUpdate", async (item: CartItem, options) => {
  await recalcCartTotal(item.cartId, options.transaction);
});

// DELETE
CartItem.addHook("afterDestroy", async (item: CartItem, options) => {
  await recalcCartTotal(item.cartId, options.transaction);
});
