import express from "express"
import { authMiddleware } from "../middlewares/auth.middleware.js"
import { getMeController, getUserProfileController } from "../controllers/user.controller.js"


const router = express.Router()

router.post("/get-me",authMiddleware,getMeController)
router.get("/get-user/:userName",getUserProfileController)


export default router