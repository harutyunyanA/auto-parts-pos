// import { JwtPayload } from "jsonwebtoken";
import "express";
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
      cashDeskId?: number;
    }
  }
}
