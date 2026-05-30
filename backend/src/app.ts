import express from "express";
import cors from "cors";
import helmet from "helmet";
import { httpLogger } from "./middlewares/http-logger.ts";
import { errorHandler } from "./middlewares/error.middleware.ts";
import productRouter from "./modules/product/product.router.ts";
import saleRouter from "./modules/sale/sale.router.ts";
import supplyRouter from "./modules/supply/supply.router.ts";
import clientsRouter from "./modules/clients/clients.router.ts";
import supplierRouter from "./modules/supplier/supplier.router.ts";
import settingsRouter from "./modules/settings/settings.router.ts";
import analyticsRouter from "./modules/analytics/analytics.router.ts";
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

app.use("/product", productRouter);
app.use("/sale", saleRouter);
app.use("/supplies", supplyRouter);
app.use("/clients", clientsRouter);
app.use("/suppliers", supplierRouter);
app.use("/settings", settingsRouter);
app.use("/analytics", analyticsRouter);

app.use(errorHandler);
