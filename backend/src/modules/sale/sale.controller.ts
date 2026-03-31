import type { Request, Response, NextFunction } from "express";
import { successResponse } from "../../utils/response.ts";
class SaleController {
  test(req: Request, res: Response, next: NextFunction) {

    return successResponse(res, { ok: true });
  }


  
}

export default new SaleController();
