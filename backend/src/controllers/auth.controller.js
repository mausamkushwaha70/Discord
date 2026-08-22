import { sendFile } from "../services/storage.service.js";
import userModel from "../models/user.model.js";
import { tokenGenerate } from "../utils/token.utils.js";

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

  const isExist = await userModel.findOne({ email });

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
