import express from "express";
import controller from "./sale.controller.ts";
import checkSource from "../../middlewares/checkSource.middleware.ts";
import { validate } from "../../middlewares/validate.middleware.ts";
import { saleItemSchema } from "../../schemas/sale.schema.ts";
const router = express.Router();

router.use(checkSource);
router.post("/", controller.createCart);
router.post("/:id/item", validate(saleItemSchema), controller.addToCart);

export default router;
