import express from "express";
import controller from "./backup.controller.ts";

const router = express.Router();

router.post("/", controller.runBackup);

export default router;
