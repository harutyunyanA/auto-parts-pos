import express from "express";
import cors from "cors";
import helmet from "helmet";
import { httpLogger } from "./middlewares/http-logger.ts";
import { errorHandler } from "./middlewares/error.middleware.ts";

export const app = express();

app.use(httpLogger);
app.use(helmet());
app.use(
  cors({
    origin: process.env.FRONTEND_URL,
    credentials: true,
  }),
);
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(errorHandler);