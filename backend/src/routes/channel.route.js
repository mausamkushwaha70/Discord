import express from "express";
import { authMiddleware } from "../middlewares/auth.middleware.js";
import { createChannel, getChannel } from "../controllers/channel.controller.js";

const router = express.Router();

router.post("/create/:serverId",authMiddleware,createChannel)
router.get("/getAll/:serverId",authMiddleware,getChannel)

export default router;