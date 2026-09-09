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
    if(!server) throw new ApiError(404,"Server not found");

    const member = await serverMember_Model.find({server:serverId}).populate()
    return res.status(200).json(
      new ApiResponse(200,member,"Server member fetched successfully")
    );
  } catch (error) {
    console.log(error)
    next(error)
  }
};
