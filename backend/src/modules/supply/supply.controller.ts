import type { Request, Response, NextFunction } from "express";
import { errorResponse, successResponse } from "../../utils/response.ts";
import { Supply, SupplyItem } from "./supply.model.ts";
import service from "./supply.service.ts";

class SupplyController {
  async newSupply(req: Request, res: Response, next: NextFunction) {
    try {
      const { supplierId } = req.body;

      if (!supplierId || isNaN(supplierId)) {
        return errorResponse(res, "Supplier id is required");
      }

      const newSupply = await service.createSupply(supplierId, req.source);
      return successResponse(res, newSupply);
    } catch (err) {
      next(err);
    }
  }

  async updateSupplier(req: Request, res: Response, next: NextFunction) {
    try {
      const { supplyId } = req.params;
      if (!supplyId) {
        return errorResponse(res, "Supply id is required", 400);
      }

      const { supplierId } = req.body;
      if (!supplierId) {
        return errorResponse(res, "Supplier id is required", 400);
      }

      const result = await service.updateSupplier(Number(supplyId), supplierId);
      return successResponse(res, result);
    } catch (err) {
      next(err);
    }
  }

  async addSupplyItem(req: Request, res: Response, next: NextFunction) {
    try {
      const { supplyId } = req.params;
      if (!supplyId) {
        return errorResponse(res, "Supply id is required", 400);
      }
      
      const supply = req.validated?.body;

      const result = await service.addSupplyItem(Number(supplyId), supply);
      return successResponse(res, result);
    } catch (err) {
      next(err);
    }
  }

  async deleteSupplyItem(req: Request, res: Response, next: NextFunction) {
    try {
      const { supplyId, itemId } = req.params;

      console.log(supplyId, itemId);

      const result = await service.deleteSupplyItem(
        Number(supplyId),
        Number(itemId),
      );

      return successResponse(res, { ok: true });
    } catch (err) {
      next(err);
    }
  }

  async updateSupplyItem(req: Request, res: Response, next: NextFunction) {
    try {
      const { supplyId, itemId } = req.params;
      if (!supplyId || !itemId) {
        return errorResponse(res, "Supply id and item id are required", 400);
      }

      const supplyItemData = req.validated?.body;

      const result = await service.updateSupplyItem(
        Number(supplyId),
        Number(itemId),
        supplyItemData,
      );

      return successResponse(res, result);
    } catch (err) {
      next(err);
    }
  }

  async completeSupply(req: Request, res: Response, next: NextFunction) {
    try {
      const { supplyId } = req.params;

      if (!supplyId) {
        return errorResponse(res, "Supply id is required", 400);
      }

      const supply = await service.completeSupply(Number(supplyId));

      if (supply.succes) {
        return successResponse(res, supply.data);
      }
      return errorResponse(res, "Internal error", 500);
    } catch (err) {
      next(err);
    }
  }

  async getAllSupplies(req: Request, res: Response, next: NextFunction) {
    try {
      const { status, totalCost } = req.query;
      const supplies = await service.getAllSupplies(String(status));
      if (supplies.succes) {
        return successResponse(res, supplies.data);
      } else {
        return errorResponse(res, "Supplies are not found", 404);
      }
    } catch (err) {
      next(err);
    }
  }
}

export default new SupplyController();
