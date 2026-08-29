import { sendFile } from "../services/storage.service.js";
import userModel from "../models/user.model.js";
import bcrypt from "bcrypt";
import { tokenGenerate } from "../utils/token.utils.js";
import redis from "../config/redis.config.js";
import { generateOTP } from "../utils/otp.utill.js";
import { sendEmail } from "../services/email.service.js";

export const userRegisterController = async (req, res) => {
  try {
    const { username, fullName, email, phone, password, dob } = req.body;
    const file = req.file;

    if (!username || !email || !password) {
      return res.status(400).json({
        success: false,
        message: "all field are required",
      });
    }

    if (!file) {
      return res.status(400).json({
        success: false,
        message: "unpload file",
      });
    }

    const fileUpload = await sendFile(file.buffer, file.originalname);

    const user = await userModel.create({
      username,
      fullName,
      email,
      phone,
      password,
      profile_pic: fileUpload.url,
      dob,
    });

    const accessToken = tokenGenerate(user._id, "20min");
    const refreshToken = tokenGenerate(user._id, "2d");

    res.cookie("accessToken", accessToken, {
      httpOnly: true,
      maxAge: 15 * 60 * 1000,
      secure: false,
      sameSite: "strict",
    });

    res.cookie("refreshToken", refreshToken, {
      httpOnly: true,
      maxAge: 2 * 24 * 60 * 60 * 1000,
      sucure: false,
      sameSite: "strict",
    });

    return res.status(201).json({
      success: true,
      message: "User registered successfully",
      user,
    });
  } catch (error) {
    console.error(error);
    return res.status(500).json({
      success: false,
      message: "Unable to register user",
      error: error.message,
    });
  }
};

export const userLoginController = async (req, res) => {
  const { email, password } = req.body;

  if (!email || !password) {
    return res.status(400).json({
      success: false,
      message: "credential is required",
    });
  }

  const isExist = await userModel.findOne({ email }).select("password")
  console.log(isExist)

  if (!isExist) {
    return res.status(404).json({
      success: false,
      message: "user not found",
    });
  }

  if (!isExist.password || isExist.authProvider === "google") {
    return res.status(400).json({
      success: false,
      message: "continue with google",
    });
  }

  const isPassCorrect = await isExist.comparePass(password);

  if (!isPassCorrect) {
    return res.status(404).json({
      success: false,
      message: "Invalid credentials",
    });
  }

  const accessToken = tokenGenerate(isExist._id, "20min");
  const refreshToken = tokenGenerate(isExist._id, "2d");

  res.cookie("accessToken", accessToken, {
    httpOnly: true,
    maxAge: 20 * 60 * 1000,
    secure: false,
    sameSite: "strict",
  });

  res.cookie("refreshToken", refreshToken, {
    httpOnly: true,
    maxAge: 2 * 24 * 60 * 60 * 1000,
    secure: false,
    sameSite: "strict",
  });

  const userData = isExist.toObject();

  delete userData.password;

  return res.status(200).json({
    success: true,
    message: "successfully loggedIn",
    isExist,
  });
};

export const googleAuthcontroller = async (req, res) => {
  try {
    const { email, name, given_name, picture, sub } = req.user._json;
    console.log(req.user);
    const user = await userModel.findOne({ email });

    if (user) {
      if (!user.googleId) {
        user.googleId = sub;
        await user.save();
      }

      const accessToken = tokenGenerate(user._id, "20min");
      const refreshToken = tokenGenerate(user._id, "2d");

      res.cookie("accessToken", accessToken, {
        httpOnly: true,
        maxAge: 20 * 60 * 1000,
      });

      res.cookie("refreshToken", refreshToken, {
        httpOnly: true,
        maxAge: 2 * 24 * 60 * 60 * 1000,
      });

      return res.status(200).json({
        success: true,
        message: "user loggedin successfully",
        user,
      });
    }

    const newUser = await userModel.create({
      username: given_name,
      fullName: name,
      email,
      profile_pic: picture,
      googleId: sub,
      authProvider: req.user.provider,
    });

    const accessToken = generateToken(newUser._id, "15min");
    const refreshToken = generateToken(newUser._id, "2d");

    res.cookie("accessToken", accessToken, {
      httpOnly: true,
      maxAge: 15 * 60 * 1000,
    });

    res.cookie("refreshToken", refreshToken, {
      httpOnly: true,
      maxAge: 2 * 24 * 60 * 60 * 1000,
    });

    return res.status(201).json({
      success: true,
      message: "user register successfully",
      newUser,
    });
  } catch (error) {
    console.log(error);
    return res.status(500).json({
      success: false,
      message: "internal server error",
      error: error.message,
    });
  }
};

export const userLogoutController = async (req, res) => {
  // before using redis three credentials is required
  // host, port, password

  try {
    const { refreshToken, accessToken } = req.cookies;
    if (accessToken) {
      await redis.set(`Bearer: accessToken: ${accessToken}`, "true");
    }

    if (refreshToken) {
      await redis.set(`Bearer: refreshToken: ${refreshToken}`, "true");
    }
    // await redis.set(`tokenblackelisted${accessToken}`,true)

    res.clearCookie("accessToken");
    res.clearCookie("refreshToken");

    return res.status(200).json({
      success: true,
      message: "logout successfully",
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      error: error.message,
    });
  }
};

export const forgatePasswordController = async (req, res) => {
  try {
    const { email } = req.body;

  if (!email) {
    return res.status(400).json({
      success: false,
      message: "email not found",
    });
  }

  const user = await userModel.findOne({ email })

  if (!user)
    return res.status(404).json({
      success: false,
      message: "user not found",
    });

  const OTP = generateOTP();

  const hashedOPT = bcrypt.hashSync(OTP, 10);

  await redis.set(`reset-password-hashed-${email}`, hashedOPT, "EX", 5 * 60);

  await sendEmail(
    "bhimkushwaha1977@gmail.com",
    "Reset your app password",
    `Do not share with anyone. This ${OTP} OTP message is only valid upto 5 minutes `,
    `<div style="font-family: Arial, sans-serif">
      <h2>Password Reset Request</h2>

      <p>Your OTP for resetting your password is:</p>

      <h1 style="letter-spacing: 5px;">${OTP}</h1>

      <p>
        This OTP will expire in <strong>5 minutes</strong>.
      </p>

      <p>If you did not request a password reset, please ignore this email.</p>
    </div>`,
  );

  return res.status(200).json({
    success:true,
    message:"otp send sucessfully"
  })
  } catch (error) {
    console.log(error)
    return res.status(500).json({
      success:false,
      message:"Internal server error",
      error:error.message
    })
  }
};
