import express from "express";
import controller from "./settings.controller.ts";

const router = express.Router();

router.get("/", controller.getAll);
router.patch("/", controller.update);

export default router;
