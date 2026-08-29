import express from "express"
import { authMiddleware } from "../middlewares/auth.middleware.js"
import { getMeController, getUserProfileController, updateUserController, userDeleteController } from "../controllers/user.controller.js"


const router = express.Router()

router.post("/get-me",authMiddleware,getMeController)
router.get("/get-user/:id",authMiddleware,getUserProfileController)
router.patch("/update",authMiddleware,updateUserController)
router.delete("/delete",authMiddleware,userDeleteController)


export default router