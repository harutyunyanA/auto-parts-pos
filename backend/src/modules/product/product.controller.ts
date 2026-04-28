import type { Request, Response, NextFunction } from "express";
import { errorResponse, successResponse } from "../../utils/response.ts";
import service from "./product.service.ts";
import type {
  ProductType,
  ProductCreationType,
  paginationParams,
  searchParams,
} from "./product.types.ts";
import type { sourceType } from "../../types/source.types.ts";
import { Product } from "./product.model.ts";
import { NotFoundError } from "../../utils/errors.ts";

class ProductController {
  async getProduct(req: Request, res: Response, next: NextFunction) {
    try {
      const { code, source }: { code: number; source: sourceType } =
        req.validated?.query;

      const product: ProductType | undefined = await service.getProductByCode(
        Number(code),
        source,
      );

      return successResponse(res, product);
    } catch (err) {
      next(err);
    }
  }

  async addProduct(req: Request, res: Response, next: NextFunction) {
    try {
      const productData: ProductCreationType = req.validated?.body;
      const product: any = await service.addProduct(productData);

      return successResponse(res, product, 201);
    } catch (err) {
      next(err);
    }
  }

  async deleteProduct(req: Request, res: Response, next: NextFunction) {
    try {
      const { code, source }: { code: number; source: sourceType } =
        req.validated?.query;

      const result = await service.deleteProduct(code, source);
      if (!result) {
        throw new NotFoundError("Product not found or already deleted");
      }
      return successResponse(res, {
        message: "product successfully deleted",
      });
    } catch (err) {
      next(err);
    }
  }

  async updateProduct(req: Request, res: Response, next: NextFunction) {
    try {
      const { code, source }: { code: number; source: sourceType } =
        req.validated?.query;

      const product = await service.getProductByCode(code, source);

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

      // result = await service.updateProduct(code, source, filteredData);
      // return successResponse(res, result);
    } catch (err) {
      next(err);
    }
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

  async getAllProducts(req: Request, res: Response, next: NextFunction) {
    try {
      const source: sourceType = req.source as sourceType;

      const paginationParams: paginationParams = {
        page: req.validated?.query.page,
        limit: req.validated?.query.limit,
      };

      const searchParams: searchParams = {
        code: req.validated?.query.code,
        type: req.validated?.query.type,
        name: req.validated?.query.name,
        serial_number: req.validated?.query.serial_number,
        WXQP: req.validated?.query.WXQP,
      };


      const products = await service.getAllProducts(
        source,
        paginationParams,
        searchParams,
      );

      return successResponse(res, products);
    } catch (err) {
      next(err);
    }
  }
}
export default new ProductController();
