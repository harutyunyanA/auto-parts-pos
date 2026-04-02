import type { Request, Response, NextFunction } from "express";
import { errorResponse, successResponse } from "../../utils/response.ts";
import { Cart } from "./sale.model.ts";
import service from "./sale.service.ts";

class SaleController {
  test(req: Request, res: Response, next: NextFunction) {
    return successResponse(res, { ok: true });
  }

  async createCart(req: Request, res: Response, next: NextFunction) {
    try {
      const result = await service.createCart();
      if (!result.success) {
        return errorResponse(
          res,
          "FAILD_TO_CREATE_CART",
          "Cart creation failed due to an unknown error",
          500,
        );
      }

      return successResponse(res, result.data, 201);
    } catch (e) {
      next(e);
    }
  }

  async addToCart(req: Request, res: Response, next: NextFunction) {
    // try {
    const { id } = req.params as { id: string };
    const cartId: number = Number(id);

    if (!id) {
      return errorResponse(res, "", "", 400);
    }

    const product = req.body;

    if (!product) {
      return errorResponse(
        res,
        "PRODUCT_DATA_REQUIRED",
        "Product data required. Expecting product code",
        400,
      );
    }
    // console.log(product);

    const updatedCart = await service.addProductToCart(cartId, {
      ...product,
      source: req.source,
    });

    return successResponse(res, { ok: true });
    // } catch (e) {
    //   next(e);
    // }
  }
}

export default new SaleController();
