import express from "express"
import {upload} from "../config/multer.js"
import { forgatePasswordController, googleAuthcontroller, userLoginController, userLogoutController, userRegisterController } from "../controllers/auth.controller.js";
import passport from "passport";
import { authMiddleware } from "../middlewares/auth.middleware.js";
import { forgate } from "../controllers/forgateController.js";

const router = express.Router();

router.post("/user-register",upload.single("image"), userRegisterController)
router.post("/user-login", userLoginController)
router.get("get-me",authMiddleware)
router.get('/google', passport.authenticate('google', { scope: ['profile', 'email'] }));
router.get('/google/callback',passport.authenticate("google",{
        session:false, failureRedirect:"/"}),googleAuthcontroller);
router.post('/user-logout',userLogoutController)

router.get('/forgate', forgate)
router.get("/forgate-password",authMiddleware,forgatePasswordController)

export default router;

