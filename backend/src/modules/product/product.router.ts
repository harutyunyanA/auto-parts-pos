import express from "express";
import controller from "./product.controller.ts";
const router = express.Router();

router.get("/:code", controller.getProducts);

export default router;
