// import { JwtPayload } from "jsonwebtoken";

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
    }
  }
}
