import type { Request, Response, NextFunction } from "express";
import { errorResponse, successResponse } from "../../utils/response.ts";
import { Supply, SupplyItem } from "./supply.model.ts";
import service from "./supply.service.ts";

class SupplyController {
  async newSupply(req: Request, res: Response, next: NextFunction) {
    try {
      const { supplierId, date } = req.body;

      // if (!supplierId || isNaN(supplierId)) {
      //   return errorResponse(res, "Supplier id is required");
      // }

      // if (!date) {
      //   return errorResponse(res, "Date is required");
      // }

      const newSupply = await service.createSupply(
        supplierId,
        req.source,
        date,
      );
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

      // const supply = req.validated?.body;
      const { code } = req.body;

      const result = await service.addSupplyItem(
        code,
        Number(supplyId),
        req.source as any,
      );
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

  async updateQuantity(req: Request, res: Response, next: NextFunction) {
    try {
      const { supplyId, itemId } = req.params;
      const { quantity } = req.body;
      const result = await service.updateItemQuantity(
        Number(supplyId),
        Number(itemId),
        Number(quantity),
      );
      return successResponse(res, result);
    } catch (err) {
      next(err);
    }
  }

  async updatePurchasePrice(req: Request, res: Response, next: NextFunction) {
    try {
      const { supplyId, itemId } = req.params;
      const { purchasePrice } = req.body;
      const result = await service.updateItemPurchasePrice(
        Number(supplyId),
        Number(itemId),
        Number(purchasePrice),
      );
      return successResponse(res, result);
    } catch (err) {
      next(err);
    }
  }

  async updateSalePrice(req: Request, res: Response, next: NextFunction) {
    try {
      const { supplyId, itemId } = req.params;
      const { salePrice } = req.body;
      const result = await service.updateItemSalePrice(
        Number(supplyId),
        Number(itemId),
        Number(salePrice),
      );
      return successResponse(res, result);
    } catch (err) {
      next(err);
    }
  }

  async updateMinQuantity(req: Request, res: Response, next: NextFunction) {
    try {
      const { supplyId, itemId } = req.params;
      const { minQuantity } = req.body;
      const result = await service.updateItemMinQuantity(
        Number(supplyId),
        Number(itemId),
        Number(minQuantity),
      );
      return successResponse(res, result);
    } catch (err) {
      next(err);
    }
  }

  async supplyStatusToggle(
    req: Request,
    res: Response,
    next: NextFunction,
  ) {
    try {
      const { supplyId } = req.params;

      if (!supplyId) {
        return errorResponse(res, "Supply id is required", 400);
      }

      const result = await service.supplyStatusToggle(Number(supplyId));

      if (result.success) {
        return successResponse(res, result.data);
      }
      return errorResponse(res, "Internal error", 500);
    } catch (err) {
      next(err);
    }
  }

  async getAllSupplies(req: Request, res: Response, next: NextFunction) {
    try {
      const result = await service.getAllSupplies();
      if (result.success) {
        return successResponse(res, result.supplies);
      } else {
        return errorResponse(res, "Supplies are not found", 404);
      }
    } catch (err) {
      next(err);
    }
  }

  async getSupplyInfo(req: Request, res: Response, next: NextFunction) {
    try {
      const { supplyId } = req.params;

      if (!supplyId) {
        return errorResponse(res, "Supply id is required");
      }

      const supplyItems = await service.getSupplyInfo(Number(supplyId));
      if (!supplyItems) {
        return errorResponse(res, "Supply is not found", 404);
      } else return successResponse(res, supplyItems.data);
    } catch (err) {
      next(err);
    }
  }
}

export default new SupplyController();
