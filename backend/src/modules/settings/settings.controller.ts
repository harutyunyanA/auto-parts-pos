import type { Request, Response, NextFunction } from "express";
import { successResponse, errorResponse } from "../../utils/response.ts";
import service from "./settings.service.ts";

class SettingsController {
  async getAll(_req: Request, res: Response, next: NextFunction) {
    try {
      const rows = await service.getAll();
      return successResponse(res, rows);
    } catch (err) {
      next(err);
    }
  }

  async update(req: Request, res: Response, next: NextFunction) {
    try {
      const { key, value } = req.body;
      if (typeof key !== "string" || !key) {
        return errorResponse(res, "key is required", 400);
      }
      if (value === undefined || value === null) {
        return errorResponse(res, "value is required", 400);
      }
      const row = await service.update(key, String(value));
      return successResponse(res, row);
    } catch (err) {
      next(err);
    }
  }
}

export default new SettingsController();
