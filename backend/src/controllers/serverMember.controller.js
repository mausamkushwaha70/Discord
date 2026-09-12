import { memoryStorage } from "multer";
import serverModel from "../models/server.model.js";
import serverMember_Model from "../models/serverMember.model.js";
import ApiError from "../utils/apiError.util.js";
import ApiResponse from "../utils/apiResponse.util.js";

export const get_ServerMember = async (req, res, next) => {
  try {
    const serverId = req.params.id;
    console.log(serverId);

    const server = await serverModel.findById(serverId);
    console.log(server);
    if (!server) throw new ApiError(404, "Server not found");

    const member = await serverMember_Model
      .find({ server: serverId })
      .populate("user", "username profile_pic");
    return res
      .status(200)
      .json(new ApiResponse(200, member, "Server member fetched successfully"));
  } catch (error) {
    console.log(error);
    next(error);
  }
};

export const removeMember = async (req, res, next) => {
  try {
    const { serverId } = req.params;
    const server = await serverModel.findById(serverId);

    if (!server) throw new ApiError(400, "server not found");

    const member = await serverMember_Model.find({server:serverId,user:req.user.id} );

    if(server.owner.toString()===req.user.id.toString()){
      console.log("cant remove yourSelf")
    }

    // console.log(member);
  } catch (error) {
    next(error);
  }
};
