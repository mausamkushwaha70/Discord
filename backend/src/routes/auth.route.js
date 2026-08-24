import express from "express"
import {upload} from "../config/multer.js"
import { googleAuthcontroller, userLoginController, userRegisterController } from "../controllers/auth.controller.js";
import passport from "passport";

const router = express.Router();

router.post("/user-register",upload.single("image"), userRegisterController)
router.post("/user-login", userLoginController)
router.get('/google', passport.authenticate('google', { scope: ['profile', 'email'] }));
router.get('/google/callback',passport.authenticate("google",{
        session:false, failureRedirect:"/"
    }),googleAuthcontroller)


export default router;

