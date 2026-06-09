import type { Request, Response, NextFunction } from "express";
import { errorResponse } from "../utils/response.ts";

// Records which cash desk a request originates from (X-Cash-Desk header).
// Unlike the old checkSource, this does NOT partition data — the catalogue and
// stock are shared across all desks. cashDeskId is only an attribution
// attribute stamped on carts and supplies for reporting, so it is applied only
// on the create-cart / create-supply routes, not globally.
export default function setCashDesk(
  req: Request,
  res: Response,
  next: NextFunction,
) {
  const raw = req.get("X-Cash-Desk");

  if (!raw) {
    return errorResponse(res, "Cash desk is missing (X-Cash-Desk header)", 401);
  }

  const cashDeskId = Number(raw);
  if (!Number.isInteger(cashDeskId) || cashDeskId <= 0) {
    return errorResponse(res, "Invalid cash desk id", 400);
  }

  req.cashDeskId = cashDeskId;
  next();
}
