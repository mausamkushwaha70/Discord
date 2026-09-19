import { memoryStorage } from "multer";
import serverModel from "../models/server.model.js";
import serverMember_Model from "../models/serverMember.model.js";
import ApiError from "../utils/apiError.util.js";
import ApiResponse from "../utils/apiResponse.util.js";
import asyncHandler from "../middlewares/asyncHndler.js";
import roleModel from "../models/roles.model.js";

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

    const member = await serverMember_Model.find({
      server: serverId,
      user: req.user.id,
    });

    if (server.owner.toString() === req.user.id.toString()) {
      console.log("cant remove yourSelf");
    }

    // console.log(member);
  } catch (error) {
    next(error);
  }
};

export const updateMember = asyncHandler(async (req, res) => {
  const { serverId, userId } = req.params;
  const { roles } = req.body;

  // 1. Validate roles
  if (!Array.isArray(roles)) {
    throw new ApiError(400, "Roles must be an array");
  }

  // 2. Find server
  const server = await serverModel.findById(serverId);

  if (!server) {
    throw new ApiError(404, "Server not found");
  }

  // 3. Check server owner
  if (server.owner.toString() !== req.user._id.toString()) {
    throw new ApiError(403, "Only server owner can manage member roles");
  }

  // 4. Find member
  const member = await serverMember_Model.findOne({
    server: serverId,
    user: userId,
  });

  if (!member) {
    throw new ApiError(404, "Server member not found");
  }

  // 5. Check whether all roles belong to this server
  const validRoles = await roleModel.find({
    _id: { $in: roles },
    server: serverId,
  });

  if (validRoles.length !== roles.length) {
    throw new ApiError(400, "One or more roles are invalid");
  }

  // 6. Update member roles
  member.roles = roles;

  await member.save();

  // 7. Get updated member
  const updatedMember = await serverMember_Model
    .findById(member._id)
    .populate("user", "username fullName profile_pic")
    .populate("roles", "name permissions color position");

  return res.status(200).json(
    new ApiResponse(
      200,
      updatedMember,
      "Server member successfully updated"
    )
  );
});
