import express from "express";
import controller from "./sale.controller.ts";
import checkSource from "../../middlewares/checkSource.middleware.ts";
const router = express.Router();

router.post("", checkSource, controller.test);

export default router;
