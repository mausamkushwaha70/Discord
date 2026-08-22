import express from "express"
import {upload} from "../config/multer.js"
import { userLoginController, userRegisterController } from "../controllers/auth.controller.js";

const router = express.Router();

router.post("/user-register",upload.single("image"), userRegisterController)
router.post("/user-login", userLoginController)


export default router;

