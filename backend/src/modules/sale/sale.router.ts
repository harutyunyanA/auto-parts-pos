import express from "express";
import controller from "./sale.controller.ts";
import checkSource from "../../middlewares/checkSource.middleware.ts";
import { validate } from "../../middlewares/validate.middleware.ts";
import { cartItemSchema } from "../../schemas/sale.schema.ts";
const router = express.Router();

router.use(checkSource);
router.post("/", controller.createCart);
router.post(
  "/:cartId/item/:code",
  validate(cartItemSchema),
  controller.addToCart,
);

router.patch("/normalize/:cartId", controller.normalizeCart)

// router.patch("/:cartId/item/:code", )

export default router;
