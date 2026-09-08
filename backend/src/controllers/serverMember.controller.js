import serverModel from "../models/server.model.js";
import serverMember_Model from "../models/serverMember.model.js";
import ApiError from "../utils/apiError.util.js";

export const get_ServerMember = async (req, res, next) => {
  try {
    const { serverId } = req.params;

    const server = await serverModel.findById(serverId);

    if (!server) throw new ApiError(404, "server not found or not exist");

    const serverMember = await serverMember_Model
      .find({ server: serverId })
      .populate("user", "profile_pic")
      .populate("roles", "name permissions color position");

    console.log(serverMember);
  } catch (error) {
    console.log(error);
    next(error);
  }
};
