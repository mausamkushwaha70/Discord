import asyncHandler from "../middlewares/asyncHndler.js";
import channelModel from "../models/channels.model.js";
import serverModel from "../models/server.model.js";
import ApiError from "../utils/apiError.util.js";
import ApiResponse from "../utils/apiResponse.util.js";

export const createChannel = asyncHandler(async (req, res) => {
  const { serverId } = req.params;
  const { channelName, channelType, position, isPrivate } = req.body;

  const server = await serverModel.findById(serverId);
  if (!server) {
    throw new ApiError(404, "Server not found");
  }

  if (server.owner.toString() !== req.user._id.toString()) {
    throw new ApiError(403, "Only Owner can create channels");
  }

  const channel = await channelModel.create({
    channelName,
    channelType,
    server: serverId,
    position,
    isPrivate,
  });
  if (!channel) {
    throw new ApiError(401, "create a channel");
  }

  return res
    .status(201)
    .json(new ApiResponse(201, channel, "Channel successfully creaated"));
});
