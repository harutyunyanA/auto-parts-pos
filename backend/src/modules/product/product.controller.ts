import type { Request, Response, NextFunction } from "express";
import { errorResponse, successResponse } from "../../utils/response.ts";
import service from "./product.service.ts";

class ProductController {
  async getProducts(req: Request, res: Response, next: NextFunction) {
    const { code } = req.params;
    const products = await service.getProductByCode(Number(code));
    if (products.length === 0)
      return errorResponse(res, "PRODUCT_NOT_FOUND", "product not found", 404);

    return successResponse(res, products);
  }
}
export default new ProductController();
