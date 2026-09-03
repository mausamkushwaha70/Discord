import express from "express";
import { createServer } from "../controllers/server.controller.js";
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

export default router;
