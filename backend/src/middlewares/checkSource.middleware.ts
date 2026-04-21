import type { Request, Response, NextFunction } from "express";
import type { sourceType } from "../types/source.types.ts";
import { errorResponse } from "../utils/response.ts";

export default function checkSource(
  req: Request,
  res: Response,
  next: NextFunction,
) {
  const source = req.get("X-Source-Type");

  if (!source) {
    return errorResponse(
      res,
      "Source is missing (X-Source-Type header)",
      401,
    );
  }

  if (source !== "soviet" && source !== "import") {
    return errorResponse(
      res,
      "Invalid source type. Must be 'soviet' or 'import'",
      401,
    );
  }

  req.source = source as sourceType;

  next();
}
