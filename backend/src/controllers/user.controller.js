import userModel from "../models/user.model.js";

export const getMeController = async (req,res) => {
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
            data:user
        });
    } catch (error) {
        console.log(error);
        return res.status(500).json({
            success: false,
            message: "Internal server error",
        });
    }
};
