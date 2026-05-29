import type { Request, Response, NextFunction } from "express";
import { createBackup } from "./backup.service.ts";
import { successResponse } from "../../utils/response.ts";

async function runBackup(_req: Request, res: Response, next: NextFunction) {
  try {
    const file = await createBackup();
    successResponse(res, { file });
  } catch (err) {
    next(err);
  }
}

export default { runBackup };
