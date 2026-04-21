import express from "express";
import controller from "./clients.controller.ts";

const router = express.Router();

router.get("/", controller.getAllClients);

export default router;
