import express from "express";
import { authMiddleware } from "../middlewares/auth.middleware.js";
import { createChannel, deleteChannel, getChannel, updateChannel } from "../controllers/channel.controller.js";

const router = express.Router();

router.post("/create/:serverId",authMiddleware,createChannel)
router.get("/getAll/:serverId",authMiddleware,getChannel)
router.patch("/update/:serverId/:channelId",authMiddleware,updateChannel)
router.delete("/delete/:serverId/:channelId",authMiddleware,deleteChannel)
export default router;