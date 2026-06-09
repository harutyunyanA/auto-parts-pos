import type { Request, Response, NextFunction } from "express";
import { successResponse } from "../../utils/response.ts";
import service from "./cashdesk.service.ts";

class CashDeskController {
  async getActive(_req: Request, res: Response, next: NextFunction) {
    try {
      const rows = await service.getActive();
      return successResponse(res, rows);
    } catch (err) {
      next(err);
    }
  }
}

export default new CashDeskController();
