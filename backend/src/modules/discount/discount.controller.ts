import type { Request, Response, NextFunction } from "express";
import { successResponse } from "../../utils/response.ts";
import service from "./discount.service.ts";
import logger from "../../utils/logger.ts";
import type { sourceType } from "../../types/source.types.ts";

class DiscountController {
  async applyBulk(req: Request, res: Response, next: NextFunction) {
    try {
      const rules = req.validated?.body.rules;
      const result = await service.applyBulk(req.source as sourceType, rules);
      return successResponse(res, result);
    } catch (err) {
      logger.error(err);
      next(err);
    }
  }

  async resetAll(req: Request, res: Response, next: NextFunction) {
    try {
      const result = await service.resetAll(req.source as sourceType);
      return successResponse(res, result);
    } catch (err) {
      logger.error(err);
      next(err);
    }
  }

  async getRules(req: Request, res: Response, next: NextFunction) {
    try {
      const rules = await service.getRules(req.source as sourceType);
      return successResponse(res, rules);
    } catch (err) {
      logger.error(err);
      next(err);
    }
  }

  async deleteRule(req: Request, res: Response, next: NextFunction) {
    try {
      const { id } = req.validated?.params;
      const result = await service.deleteRule(req.source as sourceType, id);
      return successResponse(res, result);
    } catch (err) {
      logger.error(err);
      next(err);
    }
  }

  async deleteAllRules(req: Request, res: Response, next: NextFunction) {
    try {
      const result = await service.deleteAllRules(req.source as sourceType);
      return successResponse(res, result);
    } catch (err) {
      logger.error(err);
      next(err);
    }
  }
}

export default new DiscountController();
