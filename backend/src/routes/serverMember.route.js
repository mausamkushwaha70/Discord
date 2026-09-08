import express from "express"
import { get_ServerMember } from "../controllers/serverMember.controller.js";
import { authMiddleware } from "../middlewares/auth.middleware.js";

const router = express.Router();

router.get("/get_member/:id",authMiddleware,get_ServerMember)




export default router ;