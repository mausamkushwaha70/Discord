import roleModel from "../models/roles.model.js";
import serverModel from "../models/server.model.js";
import ApiError from "../utils/apiError.util.js";
import ApiResponse from "../utils/apiResponse.util.js";

export const createRole = async (req, res, next) => {
  try {
    const { serverId } = req.params;
    const { name, permissions, color, position } = req.body;

    if (!name) throw new ApiError(400, "Role name is required");

    const server = await serverModel.findById(serverId);
    if (!server) throw new ApiError(404, "Server not found");

    if (server.owner.toString() !== req.user._id.toString()) {
      throw new ApiError(403, "Only server owner can create roles");
    }

    const role = await roleModel.create({
      name,
      server: serverId,
      permissions,
      color,
      position,
    });

    return res
      .status(201)
      .json(new ApiResponse(201, role, "Role created successfully"));
  } catch (error) {
    console.log(error);
    next(error);
  }
};
