import type { Request, Response, NextFunction } from "express";
import type { sourceType } from "../types/source.types.ts";
import { errorResponse } from "../utils/response.ts";

export default function checkSource(
  req: Request,
  res: Response,
  next: NextFunction,
) {
  const authHeader = req.get("authorization");

  if (!authHeader) {
    return errorResponse(
      res,
      "INVALID_OR_MISSING_SOURCE",
      "Source is missing",
      401,
    );
  }

  const [type, source] = authHeader.split(" ");

  if (type !== "Bearer" || !source) {
    return errorResponse(
      res,
      "INVALID_OR_MISSING_Source",
      "Source is missing",
      401,
    );
  }

  req.source = source;

  next();
}
