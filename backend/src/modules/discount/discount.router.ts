import express from "express";
import controller from "./discount.controller.ts";
import checkSource from "../../middlewares/checkSource.middleware.ts";
import { validate } from "../../middlewares/validate.middleware.ts";
import { bulkDiscountSchema } from "../../schemas/discount.schema.ts";

const router = express.Router();

router.use(checkSource);

router.patch("/bulk", validate(bulkDiscountSchema), controller.applyBulk);
router.patch("/reset-all", controller.resetAll);

export default router;
