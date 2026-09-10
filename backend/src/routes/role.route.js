import express from "express";
import { authMiddleware } from "../middlewares/auth.middleware.js";
import { createRole } from "../controllers/role.controller.js";
const router = express.Router();

router.post("/createRole/:serverId", authMiddleware, createRole);

export default router;
