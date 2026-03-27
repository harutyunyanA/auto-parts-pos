import type { NextFunction, Request, Response } from "express";
import { errorResponse } from "../utils/response.ts";

export function errorHandler(
  err: any,
  req: Request,
  res: Response,
  next: NextFunction
) {
  // custom error
  if (err.code && err.message) {
    return errorResponse(res, err.code, err.message, err.statusCode ?? 400);
  }

  // any other error
  console.error(err);

  return errorResponse(
    res,
    "INTERNAL_SERVER_ERROR",
    "Something went wrong",
    500
  );
}