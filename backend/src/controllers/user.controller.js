import userModel from "../models/user.model.js";

export const getMeController = async (req, res) => {
    try {
        const user = await userModel.findById(req.user.id).select("     password")

        if (!user) {
            return res.status(404).json({
                success: false,
                message: "user not found",
            });
        }

        return res.status(200).json({
            success: true,
            message: "fetched myProfile",
            data: user
        });
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
        const { userName } = req.params;
        console.log(req.params);
        const user = await userModel.findOne({ userName });

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
