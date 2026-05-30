import express from "express";
import controller from "./analytics.controller.ts";
import checkSource from "../../middlewares/checkSource.middleware.ts";

const router = express.Router();

router.use(checkSource);

router.get("/suppliers", controller.getSupplierStats);
router.get("/top-products", controller.getTopProducts);
router.get("/dead-stock", controller.getDeadStock);

export default router;
