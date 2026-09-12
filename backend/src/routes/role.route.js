import express from "express";
import { authMiddleware } from "../middlewares/auth.middleware.js";
import { createRole, get_SingleRole, getAllRoles } from "../controllers/role.controller.js";

const router = express.Router();

router.post("/createRole/:serverId", authMiddleware, createRole);
router.get("/get_Role/:roleId", authMiddleware, get_SingleRole);
router.get("/get_allRole/:serverId", authMiddleware,getAllRoles );


export default router;
