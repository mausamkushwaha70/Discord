import userModel from "../models/user.model";
import ApiError from "../utils/apiError.util";
import asyncHandler from "./asyncHndler";
import jwt from "jsonwebtoken";

export const socketAtuhMiddleware = asyncHandler(async (socket, next) => {

    const cookies = socket.handshake.header.coockie;
    if (!cookies) throw new ApiError(401, "Authentication is required");

    const accessToken = cookies
        .split(";")
        .find((cookie) => cookie.startsWith("accessToken="))
        ?.split("=")[1];
    if (!accessToken) throw new ApiError(401, "unauthorized");

    const isBlacklisted = await redis.get(
        `Bearer : accessTokenToken :${accessToken}`,
    );
    if (isBlacklisted) throw new ApiError(403, "token is invalid");

    const decoded = jwt.verify(accessToken, process.env.JWT_SECRET);
    console.log(decoded);

    const user = await userModel.findById(decoded.id);
    if (!user) throw new ApiError(404, "user not found");

    socket.user = user;

    next();
});
