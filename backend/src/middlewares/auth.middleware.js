import dotenv from "dotenv"
dotenv.config()
import jwt from "jsonwebtoken"
import userModel from "../models/user.model.js";
import cookieParser from "cookie-parser";

export const authMiddleware = async(req, res, next)=> {
    try {
        const token = req.cookies.accessToken;

    if(!token){
        return res.status(404).json({
            success:false,
            message:"token not found"
        })
    }

    const decode = jwt.verify(token, process.env.JWT_SECRET)

    if(!decode) return res.status(401).json({
        success:false,
        message:"unauthorized"
    })

    const user = await userModel.findById(decode.id);

    if (!user) {
            return res.status(404).json({
                success: false,
                message: "User not found"
            });
        }

    req.user = user;
    console.log(user)
    next();
    } catch (error) {
        console.log(error)
        return res.status(500).json({
            success:false,
            message:"invalid or token expired",
            error:error.message
        })      
    }


}