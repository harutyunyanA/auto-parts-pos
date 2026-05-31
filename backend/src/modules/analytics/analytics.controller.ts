import type { Request, Response, NextFunction } from "express";
import { successResponse } from "../../utils/response.ts";
import service from "./analytics.service.ts";
import logger from "../../utils/logger.ts";
import type { sourceType } from "../../types/source.types.ts";

class AnalyticsController {
  async getSupplierStats(req: Request, res: Response, next: NextFunction) {
    try {
      const { from, to } = req.query as { from?: string; to?: string };
      const data = await service.getSupplierStats(
        req.source as sourceType,
        from,
        to,
      );
      return successResponse(res, data);
    } catch (err: any) {
      logger.error(err.message);
      next(err);
    }
  }

  async getDeadStock(req: Request, res: Response, next: NextFunction) {
    try {
      const { days } = req.query as { days?: string };
      const data = await service.getDeadStock(
        req.source as sourceType,
        days ? Number(days) : 90,
      );
      return successResponse(res, data);
    } catch (err: any) {
      logger.error(err.message);
      next(err);
    }
  }
}

export default new AnalyticsController();
