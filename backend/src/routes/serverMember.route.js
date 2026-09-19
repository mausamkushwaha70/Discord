import express from "express";
import {
  get_ServerMember,
  removeMember,
  updateMember,
} from "../controllers/serverMember.controller.js";
import { authMiddleware } from "../middlewares/auth.middleware.js";

const router = express.Router();

router.get("/get_member/:id", authMiddleware, get_ServerMember);
router.delete("/remove/:serverId", authMiddleware, removeMember);
router.patch("/update/:serverId/:userId", authMiddleware, updateMember);

export default router;
