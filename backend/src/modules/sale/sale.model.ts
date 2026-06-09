import { DataTypes, Model } from "sequelize";
import type { CartType, CartItemType } from "./sale.types.ts";
import { sequelize } from "../../config/db.ts";
import { Product } from "../product/product.model.ts";
import { Client } from "../clients/clients.model.ts";
import { CashDesk } from "../cashdesk/cashdesk.model.ts";
import { recalcCartTotal } from "../../utils/recalcCartTotal.ts";

export class Cart extends Model implements CartType {
  declare id: number;
  declare status: "draft" | "completed";
  declare totalAmount: number;
  declare paymentMethod: "cash" | "card";
  declare cashDeskId: number;
  declare clientId: number | null;
  declare bonusPaid: boolean;
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
    // Which cash desk rang up the sale. Attribution only — the catalogue and
    // stock are shared across desks, so nothing is filtered by this. Plain
    // column (no DB-level FK) to avoid sync({ alter: true }) duplicating the
    // constraint on every boot; the association below uses constraints: false.
    cashDeskId: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    clientId: {
      type: DataTypes.INTEGER,
      allowNull: true,
      references: {
        model: "clients",
        key: "id",
      },
    },
    bonusPaid: {
      type: DataTypes.BOOLEAN,
      allowNull: false,
      defaultValue: false,
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
  declare purchasePriceAtSale: number;
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
    purchasePriceAtSale: {
      type: DataTypes.DECIMAL(12, 2),
      allowNull: true,
      defaultValue: 0,
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
    timestamps: true,
  },
);

Cart.hasMany(CartItem, {
  foreignKey: "cartId",
  as: "items",
});

Client.hasMany(Cart, {
  foreignKey: "clientId",
  as: "carts",
});

Cart.belongsTo(Client, {
  foreignKey: "clientId",
  as: "client",
});

Cart.belongsTo(CashDesk, {
  foreignKey: "cashDeskId",
  as: "cashDesk",
  constraints: false,
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
