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
      const cart = await service.createCart();

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
    if (result.success) {
      return successResponse(res, result);
    }
    return errorResponse(res, "cannot normalize", 500);
  }

  

  // async createCart(req: Request, res: Response, next: NextFunction) {
  //   try {
  //     const result = await service.createCart();
  //     if (!result.success) {
  //       return errorResponse(
  //         res,
  //         "FAILD_TO_CREATE_CART",
  //         "Cart creation failed due to an unknown error",
  //         500,
  //       );
  //     }

  //     return successResponse(res, result.data, 201);
  //   } catch (e) {
  //     next(e);
  //   }
  // }

  // async addToCart(req: Request, res: Response, next: NextFunction) {
  //   // try {
  //   const { id } = req.params as { id: string };
  //   const cartId: number = Number(id);

  //   if (!id) {
  //     return errorResponse(res, "", 400);
  //   }

  //   const product = req.body;

  //   if (!product) {
  //     return errorResponse(
  //       res,
  //       "PRODUCT_DATA_REQUIRED",
  //       "Product data required. Expecting product code",
  //       400,
  //     );
  //   }
  //   // console.log(product);

  //   const updatedCart = await service.addProductToCart(cartId, {
  //     ...product,
  //     source: req.source,
  //   });

  //   return successResponse(res, { ok: true });
  //   // } catch (e) {
  //   //   next(e);
  //   // }
  // }
}

export default new SaleController();
