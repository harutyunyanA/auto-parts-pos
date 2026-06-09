import type { Request, Response, NextFunction } from "express";
import { errorResponse, successResponse } from "../../utils/response.ts";
import service from "./product.service.ts";
import type {
  ProductType,
  ProductCreationType,
  paginationParams,
  searchParams,
} from "./product.types.ts";
import { NotFoundError } from "../../utils/errors.ts";

class ProductController {
  async getProduct(req: Request, res: Response, next: NextFunction) {
    try {
      const { id }: { id: number } = req.validated?.query;

      const product: ProductType | undefined = await service.getProductById(
        Number(id),
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
      const { id }: { id: number } = req.validated?.query;

      const result = await service.deleteProduct(id);
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
      const { id }: { id: number } = req.validated?.query;

      const productData: ProductCreationType = req.validated?.body;
      const allowedFields = [
        "name",
        "type",
        "oem",
        "WXQP",
        "quantity",
        "minimum_quantity",
        "purchase_price",
        "sale_price",
        "discount",
        "weight",
        "supplier_id",
      ];

      const filteredData = Object.fromEntries(
        Object.entries(productData).filter(([key]) =>
          allowedFields.includes(key),
        ),
      );

      const result = await service.updateProduct(id, filteredData);
      return successResponse(res, result);
    } catch (err) {
      next(err);
    }
  }

  async getProductById(req: Request, res: Response, next: NextFunction) {
    try {
      const { id } = req.query;
      const product = await service.getProductById(Number(id));
      return successResponse(res, product);
    } catch (err) {
      next(err);
    }
  }

  async getAllProducts(req: Request, res: Response, next: NextFunction) {
    try {
      const paginationParams: paginationParams = {
        page: req.validated?.query.page,
        limit: req.validated?.query.limit,
      };

      const searchParams: searchParams = {
        id: req.validated?.query.id,
        type: req.validated?.query.type,
        name: req.validated?.query.name,
        oem: req.validated?.query.oem,
        WXQP: req.validated?.query.WXQP,
        discounted: req.validated?.query.discounted,
      };

      const products = await service.getAllProducts(
        paginationParams,
        searchParams,
      );

      return successResponse(res, products);
    } catch (err) {
      next(err);
    }
  }
  async getDeficitProducts(req: Request, res: Response, next: NextFunction) {
    try {
      const products = await service.getDeficitProducts();
      return successResponse(res, products);
    } catch (err) {
      next(err);
    }
  }

  async getHistory(req: Request, res: Response, next: NextFunction) {
    try {
      const { id, oem, from, to } = req.validated?.query || {};

      if (!id && !oem)
        return errorResponse(res, "id and oem are required", 400);
      const history = await service.getProductHistory(id, oem, from, to);
      return successResponse(res, history);
    } catch (err) {
      next(err);
    }
  }
}
export default new ProductController();
