import express from "express";
import controller from "./supply.controller.ts";
import checkSource from "../../middlewares/checkSource.middleware.ts";
// import { checkSupply } from "../../middlewares/checkSupply.ts";
import { validate } from "../../middlewares/validate.middleware.ts";
import {
  createSupplyItemSchema,
  updateSupplyItemSchema,
} from "../../schemas/supply.schema.ts";

const router = express.Router();

router.use(checkSource);

router.get("/", controller.getAllSupplies);
router.get("/:supplyId", controller.getSupplyInfo);
router.post(
  "/",
  checkSource,
  // validate(createSupplySchema),
  controller.newSupply,
);

router.patch("/:supplyId/supplier", controller.updateSupplier);
router.post(
  "/:supplyId/item",
  validate(createSupplyItemSchema),
  controller.addSupplyItem,
);

router.delete("/:supplyId/item/:itemId", controller.deleteSupplyItem);

router.patch(
  "/:supplyId/item/:itemId",
  validate(updateSupplyItemSchema),
  controller.updateSupplyItem,
);

router.patch("/:supplyId/item/:itemId/quantity", controller.updateQuantity);
router.patch(
  "/:supplyId/item/:itemId/purchasePrice",
  controller.updatePurchasePrice,
);
router.patch("/:supplyId/item/:itemId/salePrice", controller.updateSalePrice);
router.patch(
  "/:supplyId/item/:itemId/minQuantity",
  controller.updateMinQuantity,
);

router.patch("/:supplyId/complete", controller.supplyStatusToggle);
export default router;
