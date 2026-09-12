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

export const get_SingleRole = async (req, res, next) => {
  try {
    const { roleId } = req.params;
    if (!roleId) throw new ApiError(400, "roleId is required");
    const role = await roleModel
      .findById(roleId)
      .select("name server permissions");
    if (!role) {
      throw new ApiError(404, "Role not found");
    }
    return res
      .status(200)
      .json(new ApiResponse(200, role, "Role fetched successfully"));
  } catch (error) {
    next(error);
  }
};

export const getAllRoles = async (req, res, next) => {
  try {
    const { serverId } = req.params;
    const server = await serverModel.findById(serverId);
    if (!server) throw new ApiError(400, "server not found");
    const roles = await roleModel
      .find({ server: serverId })
      .select("name server")
      .populate("server", "name");
    if (!roles) throw new ApiError(404, "roles not found");
    return res
      .status(200)
      .json(new ApiResponse(200, roles, "Roles successfully fetched"));
  } catch (error) {
    next(error);
  }
};
