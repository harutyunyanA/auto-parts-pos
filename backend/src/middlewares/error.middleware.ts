import type { NextFunction, Request, Response } from "express";
import { errorResponse } from "../utils/response.ts";
import { AppError } from "../utils/errors.ts";
import logger from "../utils/logger.ts";

export function errorHandler(
  err: any,
  req: Request,
  res: Response,
  next: NextFunction,
) {
  if (err instanceof AppError) {
    return errorResponse(res, err.message, err.statusCode);
  }

  // Log unexpected errors
  logger.error(err);

  // default error response for unhandled errors
  return errorResponse(
    res,
    "An unexpected error occurred",
    500,
  );
}
