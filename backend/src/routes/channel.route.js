import express from "express";
import { authMiddleware } from "../middlewares/auth.middleware.js";
import { createChannel } from "../controllers/channel.controller.js";

const router = express.Router();

router.post("/create/:serverId",authMiddleware,createChannel)


export default router;