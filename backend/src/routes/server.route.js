import express from "express";
import {
  createServer,
  getAllServer_Controller,
  getServer_Controller,
  server_Delete_controller,
  serverJoin,
  serverUpdate_controller,
} from "../controllers/server.controller.js";
import { authMiddleware } from "../middlewares/auth.middleware.js";
import { upload } from "../config/multer.js";

const router = express.Router();

router.post(
  "/create",
  authMiddleware,
  upload.fields([
    { name: "icon", maxCount: 1 },
    { name: "banner", maxCount: 1 },
  ]),
  createServer,
);
router.post("/joinServer/:inviteCode", authMiddleware, serverJoin);
router.get("/get_server/:id", authMiddleware, getServer_Controller);
router.get("/get_allServer", authMiddleware, getAllServer_Controller);
router.patch(
  "/updateServer/:id",
  authMiddleware,
  upload.fields([
    { name: "icon", maxCount: 1 },
    { name: "banner", maxCount: 1 },
  ]),
  serverUpdate_controller,
);
router.delete("/serverDelete/:id", authMiddleware, server_Delete_controller);

export default router;
