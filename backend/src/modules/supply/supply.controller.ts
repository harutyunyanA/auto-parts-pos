import type { Request, Response, NextFunction } from "express";
import { errorResponse, successResponse } from "../../utils/response.ts";
import { Supply } from "./supply.model.ts";
import service from "./supply.service.ts";

class SupplyController {
  async newSupply(req: Request, res: Response, next: NextFunction) {
    const { supplierId } = req.body;

    if (!supplierId || isNaN(supplierId)) {
      return errorResponse(res, "Supplier id is required");
    }

    const newSupply = await service.createSupply(supplierId, req.source);
    console.log(newSupply);
    return successResponse(res, { ok: true });
  }
}

export default new SupplyController();
