import dotenv from "dotenv";
dotenv.config();
import express from "express";
import authRoutes from "./routes/auth.route.js";
import { Strategy as GoogleStrategy } from "passport-google-oauth20";
import passport from "passport";
import morgan from "morgan";
import cookie from "cookie-parser";

const app = express();

app.use(cookie());
app.use(express.json());
app.use(morgan("combined"));

app.use(passport.initialize());
passport.use(
    new GoogleStrategy(
        {
            clientID: process.env.GOOGLE_CLIENT_ID,
            clientSecret: process.env.GOOGLE_CLIENT_SECRET,
            callbackURL: "http://localhost:3000/auth/google/callback",
        },
        (_, ___, profile, done) => {
            return done(null, profile);
        },
    ),
);

app.use("/auth", authRoutes);

export default app;
