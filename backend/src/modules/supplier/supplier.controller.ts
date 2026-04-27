import type { Request, Response, NextFunction } from "express";
import { successResponse, errorResponse } from "../../utils/response.ts";
import service from "./supplier.service.ts";
import logger from "../../utils/logger.ts";

class SupplierController {
  async getAll(req: Request, res: Response, next: NextFunction) {
    try {
      const suppliers = await service.getAll();
      return successResponse(res, suppliers);
    } catch (err) {
      logger.error(err);
      next(err);
    }
  }

  async getById(req: Request, res: Response, next: NextFunction) {
    try {
      const { id } = req.params;
      if (!id || isNaN(Number(id))) {
        return errorResponse(res, "id is required", 400);
      }
      const supplier = await service.getById(Number(id));
      return successResponse(res, supplier);
    } catch (err) {
      logger.error(err);
      next(err);
    }
  }

  async create(req: Request, res: Response, next: NextFunction) {
    try {
      const { name, phone } = req.body;
      if (!name) {
        return errorResponse(res, "name is required", 400);
      }
      const supplier = await service.create({ name, phone: phone ?? null });
      return successResponse(res, supplier, 201);
    } catch (err) {
      logger.error(err);
      next(err);
    }
  }

  async update(req: Request, res: Response, next: NextFunction) {
    try {
      const { id } = req.params;
      if (!id || isNaN(Number(id))) {
        return errorResponse(res, "id is required", 400);
      }
      const { name, phone } = req.body;
      const supplier = await service.update(Number(id), { name, phone });
      return successResponse(res, supplier);
    } catch (err) {
      logger.error(err);
      next(err);
    }
  }

  async delete(req: Request, res: Response, next: NextFunction) {
    try {
      const { id } = req.params;
      if (!id || isNaN(Number(id))) {
        return errorResponse(res, "id is required", 400);
      }
      const result = await service.delete(Number(id));
      return successResponse(res, result);
    } catch (err) {
      logger.error(err);
      next(err);
    }
  }
}

export default new SupplierController();
