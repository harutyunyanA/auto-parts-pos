import express from "express";
import controller from "./analytics.controller.ts";

const router = express.Router();

router.get("/suppliers", controller.getSupplierStats);
router.get("/dead-stock", controller.getDeadStock);

export default router;
