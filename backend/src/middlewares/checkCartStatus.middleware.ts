import type { Request, Response, NextFunction } from "express";
import { Cart, CartItem } from "../modules/sale/sale.model.ts";
import { errorResponse } from "../utils/response.ts";

export async function checkCartStatus(
  req: Request,
  res: Response,
  next: NextFunction,
) {
  const { cartId: rawCartId, itemId: rawItemId } = req.params;
  const cartIdNum = rawCartId ? Number(rawCartId) : undefined;
  const itemIdNum = rawItemId ? Number(rawItemId) : undefined;

  if (!cartIdNum && !itemIdNum) {
    return errorResponse(res, "cartId or itemId required", 400);
  }

  let cart;

  if (cartIdNum) {
    cart = await Cart.findByPk(cartIdNum);
    if (!cart) return errorResponse(res, "Cart is not found", 404);
  }

  if (itemIdNum) {
    const item = await CartItem.findByPk(itemIdNum);
    if (!item) return errorResponse(res, "Item is not found", 404);

    if (!cart) {
      cart = await Cart.findByPk(item.cartId);
      if (!cart) return errorResponse(res, "Cart is not found", 404);
    }
  }

  if (cart?.status === "completed") {
    return errorResponse(
      res,
      "Cart status 'completed'. Open cart before any changes",
      400,
    );
  }

  next();
}
