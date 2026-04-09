import type { Request, Response, NextFunction } from "express";
import type { Supply } from "../modules/supply/supply.types.ts";
import type { SupplyItemType } from "../modules/supply/supply.types.ts";
import { errorResponse } from "../utils/response.ts";

export function checkSupply(req: Request, res: Response, next: NextFunction) {
  const valid = false;

  const supply: Supply = req.body;

  let n = supply.items.length;

  supply.items.forEach((el: SupplyItemType) => {
    if (!el.code) {
      return errorResponse(res, `Code is required`, 400);
    }
    if (el.quantity < 0 || el.quantity == null) {
      return errorResponse(
        res,
        `Quantity for item: ${el.code} is required AND can't be negative`,
        400,
      );
    }
    if (!el.purchasePrice) {
      return errorResponse(res, `Purchase price is required`, 400);
    }
    if (!el.salePrice) {
      return errorResponse(res, `Sale price is required`, 400);
    }
  });
  next();
}
