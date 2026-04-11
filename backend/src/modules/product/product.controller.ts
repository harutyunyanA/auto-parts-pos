import type { Request, Response, NextFunction } from "express";
import { errorResponse, successResponse } from "../../utils/response.ts";
import service from "./product.service.ts";
import type { ProductType, ProductCreationType } from "./product.types.ts";
import type { sourceType } from "../../types/source.types.ts";
import { Product } from "./product.model.ts";

class ProductController {
  async getProduct(req: Request, res: Response, next: NextFunction) {
    const { code, source }: { code: number; source: sourceType } =
      req.validated?.query;

    const product: ProductType | undefined = await service.getProductByCode(
      Number(code),
      source,
    );

    if (!product)
      return errorResponse(
        res,
        // "PRODUCT_NOT_FOUND",
        "product not found",
        404,
      );

    return successResponse(res, product);
  }

  async addProduct(req: Request, res: Response, next: NextFunction) {
    const productData: ProductCreationType = req.validated?.body;

    const product: any = await service.addProduct(productData);
    if (!product) {
      errorResponse(
        res,
        // "INTERNAL_ERROR",
        "something went wrong, internal error",
        500,
      );
    }
    return successResponse(res, product, 201);
  }

  async deleteProduct(req: Request, res: Response, next: NextFunction) {
    const { code, source }: { code: number; source: sourceType } =
      req.validated?.query;

    const result = await service.deleteProduct(code, source);
    if (!result) {
      return errorResponse(
        res,
        // "NOT_FOUND",
        "product not found. Product already deleted OR doesn't exist",
        404,
      );
    }
    return successResponse(res, {
      message: "product successfully deleted",
    });
  }

  async updateProduct(req: Request, res: Response, next: NextFunction) {
    const { code, source }: { code: number; source: sourceType } =
      req.validated?.query;
    const product = await service.getProductByCode(code, source);

    if (!product) {
      return errorResponse(
        res,
        // "NOT_FOUND",
        "product with such code and source not found",
        404,
      );
    }

    const productData: ProductCreationType = req.validated?.body;
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

    // const result = await Product.update(filteredData);

    // return successResponse(res, result.dataValues);
  }

  async getProductByCode(req: Request, res: Response, next: NextFunction) {
    try {
      const { code } = req.query;
      const source = req.source as sourceType;
      const product = await service.getProductByCode(Number(code), source);
      return successResponse(res, product);
    } catch (err) {
      next(err);
    }
  }
}
export default new ProductController();
