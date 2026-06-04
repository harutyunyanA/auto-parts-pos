import { Op } from "sequelize";
import { sequelize } from "../../config/db.ts";
import type { sourceType } from "../../types/source.types.ts";
import { Product } from "../product/product.model.ts";
import productService from "../product/product.service.ts";
import type { ProductType } from "../product/product.types.ts";
import { Cart, CartItem } from "./sale.model.ts";
import { Client } from "../clients/clients.model.ts";
import dayjs from "dayjs";
import { normalizeCart } from "../../utils/normalize-cart.ts";
import {
  NotFoundError,
  BadRequestError,
  InternalServerError,
} from "../../utils/errors.ts";
import logger from "../../utils/logger.ts";
import type { TransformedCartType } from "./sale.types.ts";

class SaleService {
  async createCart(source: sourceType, date: any) {
    if (dayjs(date).format("YYYY-MM-DD") !== dayjs().format("YYYY-MM-DD")) {
      const cart = await Cart.create(
        { source, createdAt: date, updatedAt: date },
        { silent: true },
      );
      return cart.dataValues;
    } else {
      const cart = await Cart.create({ source });
      return cart.dataValues;
    }
  }

  async createCartItem(code: number, source: string, cartId: number) {
    const product: ProductType | undefined =
      await productService.getProductByCode(code, source as sourceType);

    if (!product) {
      throw new NotFoundError("Product not found");
    }

    const cart = await Cart.findByPk(cartId);
    if (!cart) {
      throw new NotFoundError("Cart not found");
    }
    if (cart.status === "completed") {
      throw new BadRequestError("Cart is completed");
    }

    const newCartItem = await CartItem.create<CartItem>({
      productId: product.id,
      cartId: cartId,
      priceAtSale: product.sale_price,
      purchasePriceAtSale: product.purchase_price,
      createdAt: cart.createdAt,
      updatedAt: cart.updatedAt,
    });

    if (!newCartItem) {
      throw new InternalServerError("Unable to create cart item");
    }

    const result = {
      ...newCartItem.dataValues,
      name: product.name,
      type: product.type,
      oem: product.oem,
      WXQP: product.WXQP,
      quantity_at_store: product.quantity,
    };

    return result;
  }

  async updateCartItemQuantity(cartItemId: number, newQty: number) {
    const t = await sequelize.transaction();

    try {
      const cartItem = await CartItem.findByPk(cartItemId, { transaction: t });
      if (!cartItem) {
        throw new NotFoundError("Cart item not found");
      }

      const product = await Product.findByPk(cartItem.productId, {
        transaction: t,
        lock: t.LOCK.UPDATE,
      });
      if (!product) {
        throw new NotFoundError("Product not found");
      }

      const oldQty = cartItem.quantity;
      const delta = newQty - oldQty;

      if (delta > 0 && product.quantity < delta) {
        throw new BadRequestError("Not enough product in stock");
      }

      product.quantity -= delta;
      cartItem.quantity = newQty;
      cartItem.totalPrice = newQty * cartItem.priceAtSale;

      await cartItem.save({ transaction: t });
      await product.save({ transaction: t });

      await t.commit();

      return {
        ...cartItem.toJSON(),
        quantityAtStore: product.quantity,
      };
    } catch (err) {
      await t.rollback();
      throw err;
    }
  }

  async updateCartItemPrice(cartItemId: number, newPrice: number) {
    const t = await sequelize.transaction();

    try {
      const cartItem = await CartItem.findByPk(cartItemId, { transaction: t });
      if (!cartItem) {
        throw new NotFoundError("Cart item not found");
      }

      cartItem.priceAtSale = newPrice;
      cartItem.totalPrice = cartItem.quantity * newPrice;

      await cartItem.save({ transaction: t });

      // Пересчёт корзины
      // await recalcCartTotal(cartItem.cartId, t);

      await t.commit();

      return {
        ...cartItem.toJSON(),
      };
    } catch (err) {
      await t.rollback();
      throw err;
    }
  }

  async deleteItemFromCart(itemId: number) {
    const t = await sequelize.transaction();

    try {
      const item = await CartItem.findByPk(itemId, { transaction: t });
      if (!item) {
        throw new NotFoundError(`item: ${itemId} is not found`);
      }

      if (item.quantity !== 0) {
        throw new BadRequestError(`Item quantity must be 0`);
      }

      await item.destroy({ transaction: t });

      await t.commit();
      return { success: true };
    } catch (err) {
      await t.rollback();
      throw err;
    }
  }

  async cartStatusToggle(cartId: number) {
    const cart = await Cart.findByPk(cartId);
    if (!cart) {
      throw new NotFoundError(`Cart: ${cartId} is not found`);
    }

    cart.status = cart.status === "draft" ? "completed" : "draft";

    await cart.save();
    return cart;
  }

  async getAllCarts() {
    const carts = await Cart.findAll();
    if (!carts) {
      throw new InternalServerError("Unable to get all carts");
    }
    return carts;
  }

  async getCartOfDate(date: string, source: sourceType) {
    const startOfDay = dayjs(date).startOf("day").toDate();
    const endOfDay = dayjs(date).add(1, "day").startOf("day").toDate();

    const records = await Cart.findAll({
      where: {
        source: source,
        createdAt: {
          [Op.gte]: startOfDay,
          [Op.lt]: endOfDay,
        },
      },
      include: [
        {
          model: CartItem,
          as: "items",
          attributes: { exclude: ["cartId", "productId"] },
          include: [
            {
              model: Product,
              as: "product",
              attributes: {
                exclude: [
                  "supplier_id",
                  "minimum_quantity",
                  "createdAt",
                  "source",
                  "id",
                  "updatedAt",
                ],
              },
            },
          ],
        },
        {
          model: Client,
          as: "client",
          attributes: ["id", "name"],
        },
      ],
    });

    if (!records) {
      throw new NotFoundError("No carts found for this date");
    }

    const transformedCarts: TransformedCartType[] = records.map((cart) => {
      const plainCart = cart.get({ plain: true });
      return {
        ...plainCart,
        items: plainCart.items.map((item: any) => {
          const { product, ...itemData } = item;
          const { quantity: stockQty, ...productInfo } = product;

          return {
            ...itemData,
            ...productInfo,
            quantityAtStore: stockQty,
          };
        }),
      };
    });

    return transformedCarts;
  }

  async cardPayment(cardId: number) {
    const cart = await Cart.findByPk(cardId);
    if (!cart) {
      throw new NotFoundError(`Cart not found`);
    }

    cart.paymentMethod = "card";
    await cart.save();
    return cart;
  }

  async setCartClient(cartId: number, clientId: number | null) {
    const cart = await Cart.findByPk(cartId);
    if (!cart) {
      throw new NotFoundError(`Cart: ${cartId} is not found`);
    }

    if (clientId !== null) {
      const client = await Client.findByPk(clientId);
      if (!client) {
        throw new NotFoundError(`Client: ${clientId} is not found`);
      }
    }

    cart.clientId = clientId;
    await cart.save();
    return cart;
  }

  async getProductHistory(source: sourceType, code?: number, oem?: string) {
    const whereProduct: any = { source };

    if (code) whereProduct.code = code;
    if (oem) whereProduct.oem = oem;

    // const productId = (
    //   await Product.findOne({
    //     where: whereProduct,
    //   })
    // )?.dataValues.id;

    // const history = await CartItem.findAll({
    //   where: {
    //     productId,
    //   },
    //   attributes: [
    //     "totalPrice",
    //     "priceAtSale",
    //     "quantity",
    //     "createdAt",
    //     "updatedAt",
    //     "cartId",
    //   ],
    //   include: [
    //     {
    //       model: Product,
    //       as: "product",
    //       attributes: ["name", "code", "oem", "WXQP"],
    //     },
    //   ],
    //   order: [["createdAt", "DESC"]],
    // });

    const history = await CartItem.findAll({
      attributes: [
        "totalPrice",
        "priceAtSale",
        "quantity",
        "createdAt",
        "updatedAt",
        "cartId",
      ],
      include: [
        {
          model: Product,
          as: "product",
          where: whereProduct,
          attributes: ["name", "code", "oem", "WXQP"],
        },
      ],
      order: [["createdAt", "DESC"]],
    });
    return history;
  }

  async getSummary(date: string, source: sourceType) {
    const startOfDay = dayjs(date, "YYYY-MM-DD").startOf("day").toDate();
    const endOfDay = dayjs(date, "YYYY-MM-DD").endOf("day").toDate();
    console.log(startOfDay, endOfDay);
    const records = await Cart.findAll({
      where: {
        source: source,
        createdAt: {
          [Op.gte]: startOfDay,
          [Op.lt]: endOfDay,
        },
        status: "completed",
      },
      attributes: ["totalAmount", "paymentMethod"],
    });
    console.log(records);

    let total = 0;
    let cardPaid = 0;

    for (let el of records) {
      if (el.paymentMethod === "card") {
        cardPaid += el.totalAmount;
      }
      total += el.totalAmount;
    }

    if (!records) {
      throw new NotFoundError("No carts found for this date");
    }

    return { totalIncome: total, totalCardIncome: cardPaid };
  }
}

export default new SaleService();
