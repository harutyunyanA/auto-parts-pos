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
const router = express.Router();

router.get("/", validate(getProductQuerySchema), controller.getProduct);
router.post("/", validate(addProductSchema), controller.addProduct);
router.delete("/", validate(getProductQuerySchema), controller.deleteProduct);
router.patch("/", validate(updateProductSchema), controller.updateProduct);
router.get("/by-id", controller.getProductById);

router.get(
  "/all",
  validate(paginationQuerySchema),
  controller.getAllProducts,
);

router.get("/deficit", controller.getDeficitProducts);

router.get("/history", validate(getProductHistorySchema), controller.getHistory)
export default router;
