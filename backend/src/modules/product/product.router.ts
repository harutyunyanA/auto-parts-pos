import express from "express";
import controller from "./product.controller.ts";
import { validate } from "../../middlewares/validate.middleware.ts";
import {
  addProductSchema,
  getProductHistorySchema,
  getProductQuerySchema,
  paginationQuerySchema,
  updateProductSchema,
} from "../../schemas/product.schema.ts";
import checkSource from "../../middlewares/checkSource.middleware.ts";
const router = express.Router();

router.get("/", validate(getProductQuerySchema), controller.getProduct);
router.post("/", checkSource, validate(addProductSchema), controller.addProduct);
router.delete("/", validate(getProductQuerySchema), controller.deleteProduct);
router.patch("/", validate(updateProductSchema), controller.updateProduct);
router.get("/by-code", checkSource, controller.getProductByCode);

router.get(
  "/all",
  checkSource,
  validate(paginationQuerySchema),
  controller.getAllProducts,
);

router.get("/history", checkSource, validate(getProductHistorySchema), controller.getHistory)
export default router;
