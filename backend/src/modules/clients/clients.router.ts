import express from "express";
import controller from "./clients.controller.ts";
import checkSource from "../../middlewares/checkSource.middleware.ts";
import { validate } from "../../middlewares/validate.middleware.ts";
import {
  createClientSchema,
  updateClientSchema,
  clientIdParamSchema,
  cartBonusPaidSchema,
} from "../../schemas/clients.schema.ts";

const router = express.Router();

router.get("/", controller.getAll);
router.post("/", validate(createClientSchema), controller.create);

// Literal route must come before the "/:id" param routes so it isn't swallowed.
router.patch(
  "/purchases/:cartId/bonus-paid",
  checkSource,
  validate(cartBonusPaidSchema),
  controller.setCartBonusPaid,
);

router.get("/:id", validate(clientIdParamSchema), controller.getById);
router.patch("/:id", validate(updateClientSchema), controller.update);
router.delete("/:id", validate(clientIdParamSchema), controller.delete);

router.get(
  "/:id/purchases",
  checkSource,
  validate(clientIdParamSchema),
  controller.getPurchases,
);
router.post(
  "/:id/pay-bonus",
  checkSource,
  validate(clientIdParamSchema),
  controller.payAllBonus,
);

export default router;
