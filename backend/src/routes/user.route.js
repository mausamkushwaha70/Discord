import express from "express"
import { authMiddleware } from "../middlewares/auth.middleware.js"
import { getMeController } from "../controllers/user.controller.js"


const router = express.Router()

router.post("/get-me",authMiddleware,getMeController)


export default router