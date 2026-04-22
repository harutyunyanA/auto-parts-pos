import type { Request, Response, NextFunction } from "express";
import { errorResponse, successResponse } from "../../utils/response.ts";
import { Cart } from "./sale.model.ts";
import service from "./sale.service.ts";
import logger from "../../utils/logger.ts";
import type { sourceType } from "../../types/source.types.ts";
import { number } from "zod";
import { normalizeCart } from "../../utils/normalize-cart.ts";

class SaleController {
  test(req: Request, res: Response, next: NextFunction) {
    return successResponse(res, { ok: true });
  }

  async createCart(req: Request, res: Response, next: NextFunction) {
    try {
      const cart = await service.createCart(req.source as sourceType);

      return successResponse(res, cart);
    } catch (err: any) {
      logger.error(err.message);
      next(err);
    }
  }

  async addToCart(req: Request, res: Response, next: NextFunction) {
    try {
      const { code, cartId } = req.validated?.params;

      if (!code) {
        return errorResponse(res, "CODE_IS_REQIRED", 400);
      }

      const source: string = req.source;
      if (!source) {
        return errorResponse(res, "source is required", 400);
      }
      if (!cartId) {
        return errorResponse(res, "cart id is required", 400);
      }

      const newCartItem = await service.createCartItem(code, source, cartId);
      return successResponse(res, { ...newCartItem });
    } catch (err: any) {
      logger.error(err.message);
      next(err);
    }
  }

  async updateCart(req: Request, res: Response, next: NextFunction) {
    try {
      const { code, cartId } = req.validated?.params;

      if (!code) {
        return errorResponse(res, "CODE_IS_REQIRED", 400);
      }

      const source: string = req.source;
      if (!source) {
        return errorResponse(res, "source is required", 400);
      }
      if (!cartId) {
        return errorResponse(res, "cart id is required", 400);
      }
    } catch (err: any) {
      logger.error(err.message);
      next(err);
    }
  }

  async normalizeCart(req: Request, res: Response, next: NextFunction) {
    const { cartId } = req.params;

    if (!cartId || !Number(cartId)) {
      return errorResponse(res, "cart id required", 400);
    }

    const result = await normalizeCart(Number(cartId));
    if (result.normalized) {
      return successResponse(res, result);
    }
    return errorResponse(res, "cannot normalize", 500);
  }

  async updateCartItemQuantity(
    req: Request,
    res: Response,
    next: NextFunction,
  ) {
    try {
      const { itemId } = req.params;
      const { quantity } = req.body;

      if (!itemId || (!quantity && quantity !== 0)) {
        return errorResponse(res, "itemId and quantity required");
      }

      const cartItem = await service.updateCartItemQuantity(
        Number(itemId),
        quantity,
      );

      return successResponse(res, cartItem);
    } catch (err: any) {
      logger.error(err.message);

      next(err);
    }
  }

  async updateCartItemPrice(req: Request, res: Response, next: NextFunction) {
    try {
      const { itemId } = req.params;
      const { price } = req.body;

      if (!itemId || (!price && price !== 0)) {
        return errorResponse(res, "itemId and price required");
      }

      const cartItem = await service.updateCartItemPrice(Number(itemId), price);

      return successResponse(res, cartItem);
    } catch (err: any) {
      logger.error(err.message);

      next(err);
    }
  }

  async deleteItemFromCart(req: Request, res: Response, next: NextFunction) {
    try {
      const { itemId } = req.params;
      if (!itemId) {
        return errorResponse(res, "Item id is required", 400);
      }

      const result = await service.deleteItemFromCart(Number(itemId));

      if (result.success) {
        return successResponse(res, {});
      }
    } catch (err: any) {
      logger.error(err.message);
      next(err);
    }
  }

  async changeCartStatus(req: Request, res: Response, next: NextFunction) {
    const { cartId } = req.params;

    if (!cartId || isNaN(Number(cartId))) {
      return errorResponse(res, "cartId required", 400);
    }
    const result = await service.cartStatusToggle(Number(cartId));

    return successResponse(res, result);
  }

  async getAllCarts(req: Request, res: Response, next: NextFunction) {
    try {
      const carts = await service.getAllCarts();
      return successResponse(res, carts);
    } catch (err: any) {
      logger.error(err.message);
      next(err);
    }
  }

  async getCartOfDate(req: Request, res: Response, next: NextFunction) {
    try {
      const { date } = req.params as { date: string };
      if (!date) {
        return errorResponse(res, "date is required", 400);
      }

      const carts = await service.getCartOfDate(date, req.source as sourceType);

      return successResponse(res, carts);
    } catch (err: any) {
      logger.error(err.message);
      next(err);
    }
  }

  async cardPayment(req: Request, res: Response, next: NextFunction) {
    try {
      const { cartId } = req.params;
      console.log(cartId);
      if (!cartId || isNaN(Number(cartId))) {
        return errorResponse(res, "cartId required", 400);
      }
      const result = await service.cardPayment(Number(cartId));
      console.log(result);
      return successResponse(res, result);
    } catch (err: any) {
      logger.error(err.message);
      next(err);
    }
  }
}

export default new SaleController();
