import type { Request, Response, NextFunction } from "express";
import { errorResponse, successResponse } from "../../utils/response.ts";
import service from "./product.service.ts";
import type {
  ProductAttributes,
  ProductCreationAttributes,
} from "./product.types.ts";

class ProductController {
  async getProduct(req: Request, res: Response, next: NextFunction) {
    const { code, source }: { code: number; source: "soviet" | "import" } =
      req.validated?.query;

    const product: ProductAttributes | null = await service.getProductByCode(
      Number(code),
      source,
    );

    if (!product)
      return errorResponse(res, "PRODUCT_NOT_FOUND", "product not found", 404);

    return successResponse(res, product);
  }

  async addProduct(req: Request, res: Response, next: NextFunction) {
    const productData: ProductCreationAttributes = req.validated?.body;

    const product: any = await service.addProduct(productData);
    if (!product) {
      errorResponse(
        res,
        "INTERNAL_ERROR",
        "something went wrong, internal error",
        500,
      );
    }
    return successResponse(res, product, 201);
  }

  async deleteProduct(req: Request, res: Response, next: NextFunction) {
    const { code, source }: { code: number; source: "soviet" | "import" } =
      req.validated?.query;

    const result = await service.deleteProduct(code, source);
    if (!result) {
      return errorResponse(
        res,
        "NOT_FOUND",
        "product not found. Product already delete OR doesn't exist",
        404,
      );
    }
    return successResponse(res, {
      message: "product successfully deleted",
    });
  }
}
export default new ProductController();
