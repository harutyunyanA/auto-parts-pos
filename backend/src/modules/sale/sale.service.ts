import { sequelize } from "../../config/db.ts";
import type { sourceType } from "../../types/source.types.ts";
import { Product } from "../product/product.model.ts";
import productService from "../product/product.service.ts";
import type { ProductType } from "../product/product.types.ts";
import { Cart, CartItem } from "./sale.model.ts";
import { normalizeCart } from "../../utils/normalize-cart.ts";

class SaleService {
  async createCart() {
    const cart = await Cart.create();

    if (!cart) {
      throw new Error("Unable to create new cart");
    }
    return cart.dataValues;
  }

  async createCartItem(code: number, source: string, cartId: number) {
    const product: ProductType | undefined =
      await productService.getProductByCode(code, source as sourceType);

    if (!product) {
      throw new Error("Product not found");
    }

    const newCartItem = await CartItem.create<CartItem>({
      productId: product.id,
      cartId: cartId,
      priceAtSale: product.sale_price,
    });

    if (!newCartItem) {
      throw new Error("Unable to create cart item");
    }

    const result = {
      ...newCartItem.dataValues,
      name: product.name,
      type: product.type,
      serial_number: product.serial_number,
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
        throw new Error("Cart item not found");
      }

      const product = await Product.findByPk(cartItem.productId, {
        transaction: t,
        lock: t.LOCK.UPDATE,
      });
      if (!product) {
        throw new Error("Product not found");
      }

      const oldQty = cartItem.quantity;
      const delta = newQty - oldQty;

      if (delta > 0 && product.quantity < delta) {
        throw new Error("Not enough product in stock");
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
        throw new Error("Cart item not found");
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
        throw new Error(`item: ${itemId} is not found`);
      }

      if (item.quantity !== 0) {
        throw new Error(`Item quantity must be 0`);
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
      throw new Error(`Cart: ${cartId} is not found`);
    }

    cart.status = cart.status === "draft" ? "completed" : "draft";

    await cart.save();
    return cart;
  }

  
}

export default new SaleService();
