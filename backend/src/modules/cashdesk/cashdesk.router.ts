import express from "express";
import controller from "./cashdesk.controller.ts";

const router = express.Router();

router.get("/", controller.getActive);

export default router;
