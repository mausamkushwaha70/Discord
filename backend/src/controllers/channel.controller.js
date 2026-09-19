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

export const getChannel = asyncHandler(async (req, res) => {
  const { serverId } = req.params;
  if (!serverId) {
    throw new ApiError(404, "serverId is required");
  }

  const channel = await channelModel.find({ server: serverId });
  if (channel === 0) {
    throw new ApiError(404, "No channel found");
  }

  return res
    .status(200)
    .json(new ApiResponse(200, channel, "channels fetched successfully"));
});

export const updateChannel = asyncHandler(async (req, res) => {
  const { serverId, channelId } = req.params;
  const { channelName, channelType, isPrivate } = req.body;

  const server = await serverModel.findById(serverId);
  if (!server) throw new ApiError(404, "server not found");

  const channel = await channelModel.findOne({
    _id: channelId,
    server: serverId,
  });

  if (!channel) {
    throw new ApiError(404, "channel not found");
  }

  if (server.owner.toString() !== req.user._id.toString()) {
    throw new ApiError(403, "only owner or admin and update channel");
  }

  if (channelName !== undefined) channel.channelName = channelName;
  if (channelType !== undefined) channel.channelType = channelType;
  if (isPrivate !== undefined) channel.isPrivate = isPrivate;

  const updatedChannel = await channel.save();

  return res
    .status(200)
    .json(new ApiResponse(200, updatedChannel, "Channel successfully updated"));
});
