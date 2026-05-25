import express from "express";
import controller from "./sale.controller.ts";
import checkSource from "../../middlewares/checkSource.middleware.ts";
import { validate } from "../../middlewares/validate.middleware.ts";
import { cartItemSchema, getProductHistorySchema } from "../../schemas/sale.schema.ts";
import { checkCartStatus } from "../../middlewares/checkCartStatus.middleware.ts";
const router = express.Router();

router.use(checkSource);

router.get("/", controller.getAllCarts);
router.post("/history", validate(getProductHistorySchema), controller.getProductHistory);
router.get("/:date", controller.getCartOfDate);
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
router.delete("/item/:itemId", checkCartStatus, controller.deleteItemFromCart);

router.patch("/:cartId/change-status/", controller.changeCartStatus);
router.patch("/:cartId/card-payment/", controller.cardPayment);
router.get("/summary/:date", controller.getSummary);
// router.patch("/:cartId/item/:code", )

export default router;
