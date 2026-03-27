import type { ApiError, ApiResponse } from "../types/response.types.ts";
import type { Response } from "express";
import logger from "./logger.ts";

export function successResponse<T>(
  res: Response,
  data: T,
  statusCode = 200
): Response<ApiResponse<T>> {
  const response: ApiResponse<T> = {
    success: true,
    data,
  };

  return res.status(statusCode).send(response);
}

export function errorResponse(
  res: Response,
  code: string,
  message: string,
  statusCode = 400
): Response<ApiResponse<null>> {
  const error: ApiError = { code, message };
  const response: ApiResponse<null> = { success: false, error };

  logger.error(`[${code}] ${message}`);

  return res.status(statusCode).send(response);
}