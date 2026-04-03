import express from "express";
import controller from "./sale.controller.ts";
import checkSource from "../../middlewares/checkSource.middleware.ts";
import { validate } from "../../middlewares/validate.middleware.ts";
import { cartItemSchema } from "../../schemas/sale.schema.ts";
import { checkCartStatus } from "../../middlewares/checkCartStatus.middleware.ts";
const router = express.Router();

router.use(checkSource);

router.post("/", controller.createCart);
router.post(
  "/:cartId/item/:code",
  validate(cartItemSchema),
  controller.addToCart,
);

router.patch("/normalize/:cartId", controller.normalizeCart);

router.patch(
  "/quantity/:itemId",
  checkCartStatus,
  controller.updateCartItemQuantity,
);
router.patch("/price/:itemId", checkCartStatus, controller.updateCartItemPrice);
router.delete("/:itemId", checkCartStatus, controller.deleteItemFromCart);

router.patch("/:cartId/change-status/", controller.changeCartStatus);

// router.patch("/:cartId/item/:code", )

export default router;
