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

  async updateProduct(req: Request, res: Response, next: NextFunction) {
    const { code, source }: { code: number; source: "soviet" | "import" } =
      req.validated?.query;
    const product = await service.getProductByCode(code, source);

    if (!product) {
      return errorResponse(
        res,
        "NOT_FOUND",
        "product with such code and source not found",
        404,
      );
    }

    const productData: ProductCreationAttributes = req.validated?.body;
    const allowedFields = [
      "name",
      "type",
      "serial_number",
      "WXQP",
      "quantity",
      "minimum_quantity",
      "purchase_price",
      "sale_price",
      "supplier_id",
      "source",
    ];

    const filteredData = Object.fromEntries(
      Object.entries(productData).filter(([key]) =>
        allowedFields.includes(key),
      ),
    );

    await product.update(filteredData);

    return successResponse(res, { ok: true });
  }
}
export default new ProductController();
