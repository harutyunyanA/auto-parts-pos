import express from "express";
import controller from "./supply.controller.ts";
import checkSource from "../../middlewares/checkSource.middleware.ts";
// import { checkSupply } from "../../middlewares/checkSupply.ts";
import { validate } from "../../middlewares/validate.middleware.ts";
import { createSupplySchema } from "../../schemas/supply.schema.ts";

const router = express.Router();

router.use(checkSource);
router.post(
  "/",
  checkSource,
//   validate(createSupplySchema),
  controller.newSupply,
);

export default router;
