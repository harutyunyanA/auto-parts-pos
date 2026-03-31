// import { JwtPayload } from "jsonwebtoken";
import "express";
import type { sourceType } from "./source.types.ts";
declare global {
  namespace Express {
    interface Request {
      //   user?: JwtPayload;
      token?: string;
      validated?: {
        body?: any;
        query?: any;
        params?: any;
      };
      source: string;
    }
  }
}
