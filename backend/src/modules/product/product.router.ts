import express from "express";
import controller from "./product.controller.ts";
import { validate } from "../../middlewares/validate.middleware.ts";
import {
  addProductSchema,
  getProductQuerySchema,
  updateProductSchema,
} from "../../schemas/product.schema.ts";
const router = express.Router();

router.get("/", validate(getProductQuerySchema), controller.getProduct);
router.post("/", validate(addProductSchema), controller.addProduct);
router.delete("/", validate(getProductQuerySchema), controller.deleteProduct);
router.patch("/", validate(updateProductSchema), controller.updateProduct);

export default router;
