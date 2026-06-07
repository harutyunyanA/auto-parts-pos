import express from "express";
import controller from "./discount.controller.ts";
import checkSource from "../../middlewares/checkSource.middleware.ts";
import { validate } from "../../middlewares/validate.middleware.ts";
import {
  bulkDiscountSchema,
  deleteRuleSchema,
} from "../../schemas/discount.schema.ts";

const router = express.Router();

router.use(checkSource);

router.patch("/bulk", validate(bulkDiscountSchema), controller.applyBulk);
router.patch("/reset-all", controller.resetAll);

router.get("/rules", controller.getRules);
router.delete("/rules", controller.deleteAllRules);
router.delete("/rules/:id", validate(deleteRuleSchema), controller.deleteRule);

export default router;
