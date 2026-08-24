import dotenv from "dotenv";
dotenv.config();
import jwt from "jsonwebtoken";

export const tokenGenerate = (id, time) => {
    return jwt.sign({ id }, process.env.JWT_SECRET,{
        expiresIn: time
        });
};
