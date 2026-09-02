import userModel from "../models/user.model.js";
import ApiError from "../utils/apiError.util.js";
import ApiResponse from "../utils/apiResponse.util.js";

export const getMeController = async (req, res) => {
  try {
    const user = await userModel.findById(req.user.id);

    if (!user) throw new ApiError(404, "user not found")

    return res.status(200).json(200,user,"myProfile fetched successfuly");
    
  } catch (error) {
    console.log(error);
    return res.status(500).json({
      success: false,
      message: "Internal server error",
    });
  }
};

export const getUserProfileController = async (req, res) => {
  try {
    const userId = req.params.id;
    console.log(req.params);
    const user = await userModel.findById(userId);

    if (!user)
      return res.status(404).json({
        success: false,
        message: "user not found",
      });

    return res.status(200).json({
      success: true,
      message: "user found successfully",
      data: user,
    });
  } catch (error) {
    console.log(error);
    return res.status(500).json({
      success: false,
      message: "Internal server error",
      error: error.message,
    });
  }
};

export const updateUserController = async (req, res) => {
  try {
    const { username, fullName, phone } = req.body;

    const updateData = {};
    if (username) {
      updateData.username = username;
    }
    if (fullName) {
      updateData.fullname = fullname;
    }
    if (phone) {
      updateData.phone = phone;
    }

    const updateUser = await userModel.findByIdAndUpdate(
      req.user.id,
      updateData,
      {
        new: true,
      },
    );

    if (!updateUser) {
      return res.status(404).json({
        success: false,
        message: "user not update",
      });
    }

    return res.status(200).json({
      success: true,
      message: "user update successfully",
      data: updateUser,
    });
  } catch (error) {
    console.log(error);
    return res.status(500).json({
      success: false,
      message: "Internal server error",
      error: error.message,
    });
  }
};

export const userDeleteController = async (req, res) => {
  try {
    const deleteUser = await userModel.findByIdAndDelete(req.user.id);

    if (!deleteUser) {
      return res.status(404).json({
        success: false,
        message: "user not found",
      });
    }

    return res.status(200).json({
      success: true,
      message: "user deleted successfully",
    });
  } catch (error) { }
};

export const searchUserController = async (req, res) => {
  try {
    const { query } = req.query;

    const user = await userModel
      .find({
        $or: [
          { username: { $regex: query, $options: "i" } },
          { fullName: { $regex: query, $options: "i" } },
        ],
      })
      .select("username fullName profile_pic");

    if (!user)
      return res.status(404).json({
        success: false,
        message: "user not exist in database or not found",
      });

      return res.status(200).json({
        success: true,
        message: "use searched successfully",
        user
      });
  } catch (error) {
      return res.status(200).json({
        success: true,
        message: "use searched successfully",
      });
    }
};
// debouncing use in search user........