import { ZodError, ZodType } from "zod";
import type { Request, Response, NextFunction } from "express";
import { errorResponse } from "../utils/response.ts";

export function validate<T extends ZodType<any>>(schema: T) {
  return function (req: Request, res: Response, next: NextFunction) {
    try {
      const parsed = schema.parse({
        body: req.body,
        query: req.query,
        params: req.params,
      });
      req.validated = parsed;
      next();
    } catch (err) {
      if (err instanceof ZodError) {
        return errorResponse(
          res,
          `VALIDATION_ERROR: 
          ${err.issues.map((e) => e.message).join(", ")}`,
          400,
        );
      }
      return errorResponse(res, "UNKNOWN_ERROR", 500);
    }
  };
}
