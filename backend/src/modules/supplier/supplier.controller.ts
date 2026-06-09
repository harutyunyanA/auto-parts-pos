import type { Request, Response, NextFunction } from "express";
import { successResponse } from "../../utils/response.ts";
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
      const { id } = req.validated.params;
      const supplier = await service.getById(id);
      return successResponse(res, supplier);
    } catch (err) {
      logger.error(err);
      next(err);
    }
  }

  async create(req: Request, res: Response, next: NextFunction) {
    try {
      const { name, phone } = req.validated.body;
      const supplier = await service.create({ name, phone: phone ?? null });
      return successResponse(res, supplier, 201);
    } catch (err) {
      logger.error(err);
      next(err);
    }
  }

  async update(req: Request, res: Response, next: NextFunction) {
    try {
      const { id } = req.validated.params;
      const { name, phone } = req.validated.body;
      const supplier = await service.update(id, { name, phone });
      return successResponse(res, supplier);
    } catch (err) {
      logger.error(err);
      next(err);
    }
  }

  async delete(req: Request, res: Response, next: NextFunction) {
    try {
      const { id } = req.validated.params;
      const result = await service.delete(id);
      return successResponse(res, result);
    } catch (err) {
      logger.error(err);
      next(err);
    }
  }

  async getSupplierSupplies(req: Request, res: Response, next: NextFunction) {
    try {
      const { id } = req.validated.params;
      const result = await service.getSuppliesBySupplier(id);
      return successResponse(res, result);
    } catch (err) {
      logger.error(err);
      next(err);
    }
  }
}

export default new SupplierController();
