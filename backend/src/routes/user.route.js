import express from "express";
import { authMiddleware } from "../middlewares/auth.middleware.js";
import {
  getMeController,
  getUserProfileController,
  searchUserController,
  updateUserController,
  userDeleteController,
} from "../controllers/user.controller.js";


const router = express.Router();

router.post("/get-me", authMiddleware, getMeController);
router.get("/get-user/:id", authMiddleware, getUserProfileController);
router.patch("/update", authMiddleware, updateUserController);
router.delete("/delete", authMiddleware, userDeleteController);
router.get("/search", authMiddleware,searchUserController);

export default router;
