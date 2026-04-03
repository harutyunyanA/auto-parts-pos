import type { sourceType } from "../../types/source.types.ts";
import productService from "../product/product.service.ts";
import type { ProductType } from "../product/product.types.ts";
import { Cart, CartItem } from "./sale.model.ts";
import type { CartItemType } from "./sale.types.ts";
// import { Cart, SaleItem } from "./sale.model.ts";

class SaleService {
  //   async createCart() {
  //     const cart = await Cart.create();
  //     if (!cart) {
  //       return {
  //         success: false,
  //       };
  //     }

  //     return {
  //       success: true,
  //       data: cart.dataValues,
  //     };
  //   }

  //   async createSaleItem(
  //     code: number,
  //     quantity: number,
  //     source: sourceType,
  //     cartId: number,
  //     // priceAtSale: number,
  //   ) {
  //     const product = await productService.getProductByCode(code, source);

  //     const saleItem = await SaleItem.create({
  //       saleId: cartId,
  //       productId: product?.id,
  //       quantity,
  //       priceAtSale: product?.sale_price,
  //       totalPrice: quantity * product?.sale_price!,
  //     });

  //     console.log(product);
  //     // const saleItem = await SaleItem.create({quantity, priceAtSale : priceAtSale ? product., })
  //   }

  //   async addProductToCart(cartId: number, product: any) {
  //     console.log(product);

  //     // const result = await SaleCart.findByPk(cartId);
  //     // if (!result) {
  //     //   return throwError("cart not found", "NOT_FOUND", 404);
  //     // }

  //     const result = await SaleItem.findOne({
  //       where: { cartId, code: product.code },
  //     });
  //     console.log(result);
  //     // // const isItemExists = await SaleItem.findOne({where : })
  //     // this.createSaleItem(product.code, product.quantity, product.source, cartId);
  //     // return result.dataValues;
  //   }

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

  

}

export default new SaleService();
