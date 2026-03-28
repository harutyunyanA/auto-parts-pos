import express from "express";
import controller from "./product.controller.ts";
import { validate } from "../../middlewares/validate.middleware.ts";
import {
  addProductSchema,
  getProductQuerySchema,
} from "../../schemas/product.schema.ts";
const router = express.Router();

// router.get("", controller.getAllProducts);
router.get("/", validate(getProductQuerySchema), controller.getProduct);
router.post("/", validate(addProductSchema), controller.addProduct);
router.delete("/", validate(getProductQuerySchema), controller.deleteProduct);

export default router;
