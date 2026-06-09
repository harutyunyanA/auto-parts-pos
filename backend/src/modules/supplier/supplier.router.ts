import express from "express";
import controller from "./supplier.controller.ts";
import { validate } from "../../middlewares/validate.middleware.ts";
import {
  createSupplierSchema,
  updateSupplierSchema,
  supplierIdParamSchema,
} from "../../schemas/supplier.schema.ts";

const router = express.Router();

router.get("/", controller.getAll);
router.get("/:id", validate(supplierIdParamSchema), controller.getById);
router.get(
  "/:id/supplies",
  validate(supplierIdParamSchema),
  controller.getSupplierSupplies,
);
router.post("/", validate(createSupplierSchema), controller.create);
router.patch("/:id", validate(updateSupplierSchema), controller.update);
router.delete("/:id", validate(supplierIdParamSchema), controller.delete);

export default router;
