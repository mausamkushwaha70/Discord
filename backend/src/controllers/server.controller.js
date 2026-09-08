import roleModel from "../models/roles.model.js";
import serverModel from "../models/server.model.js";
import serverMember_Model from "../models/serverMember.model.js";
import userModel from "../models/user.model.js";
import { createServerMember } from "../services/createServerMember.service.js";
import { sendFile } from "../services/storage.service.js";
import ApiError from "../utils/apiError.util.js";
import ApiResponse from "../utils/apiResponse.util.js";
import { generateInviteCode } from "../utils/inviteCode.util.js";

export const createServer = async (req, res, next) => {
  try {
    const { name, description, isPublic } = req.body;
    const icon = req.files?.icon;
    const banner = req.files?.banner;

    if (!name || !description) {
      return res.status(400).json({
        success: false,
        message: "name and description are required",
      });
    }

    const userId = req.user._id;

    let uploadIcon = null;
    if (icon) {
      uploadIcon = await sendFile(icon[0].buffer, icon[0].originalname);
    }

    let uploadBanner = null;
    if (banner) {
      uploadBanner = await sendFile(banner[0].buffer, banner[0].originalname);
    }

    const inviteCode = generateInviteCode();

    if (!inviteCode) throw new ApiError(404, "invite code is not available");

    const server = await serverModel.create({
      name,
      description,
      owner: userId,
      icon: uploadIcon?.url || "",
      banner: uploadBanner?.url || "",
      isPublic,
      inviteCode,
    });

    const ownerRole = await roleModel.create({
      name: "owner",
      server: server._id,
      permissions: [
        "MANAGE_SERVER",
        "MANAGE_CHANNEL",
        "MANAGE_ROLES",
        "MANAGE_MESSAGES",
      ],
      Position: 100,
    });

    // create server Member
    await createServerMember(userId, server._id, [ownerRole._id]);

    return res
      .status(201)
      .json(new ApiResponse(201, server, "Server created successfully"));
  } catch (error) {
    next(error);
  }
};

export const getServer_Controller = async (req, res, next) => {
  try {
    const { serverId } = req.params;
    const server = await serverModel.findById(serverId);

    if (!server) {
      throw new ApiError(404, "Server not found");
    }

    return res
      .status(200)
      .json(new ApiResponse(200, server, "Server fetched successfully"));
  } catch (error) {
    next(error);
  }
};

export const getAllServer_Controller = async (req, res, next) => {
  try {
    const id = req.params.id;
    const servers = await serverModel.find(id);
    if (!servers) throw new ApiError(404, "server not found");

    return res
      .status(200)
      .json(new ApiResponse(200, servers, "your server fetched successfully"));
  } catch (error) {
    console.log(error);
    next(error);
  }
};

export const serverUpdate_controller = async (req, res, next) => {
  try {
    //get srever Id
    const { id } = req.params;

    if (!id) throw new ApiError(400, "Sever Id is required");

    //find server
    const server = await serverModel.findById(id);

    if (!server) {
      throw new ApiError(404, "server not found");
    }

    // get data form body
    const { name, description, isPublic } = req.body;

    // get file from multer
    const { icon } = req.files;
    const { banner } = req.files;

    // updateServer data
    const updateServer = {};
    if (name) updateServer.name = name;
    if (description) updateServer.description = description;
    if (isPublic) updateServer.isPublic = isPublic;

    // update icon and banner
    if (icon) {
      let image = await sendFile(icon[0].buffer, icon[0].originalname);
      updateServer.icon = image.url;
    }
    if (banner) {
      let image = await sendFile(banner[0].buffer, banner[0].originalname);
      updateServer.banner = image.url;
    }
    const NewupdateServer = await serverModel.findByIdAndUpdate(
      id,
      updateServer,
      { new: true },
    );
    console.log(NewupdateServer);
    if (!NewupdateServer) throw new ApiError(404, "server not updated");

    return res
      .status(200)
      .json(
        new ApiResponse(200, NewupdateServer, "Server updated successfully"),
      );
  } catch (error) {
    console.log(error);
    next(error);
  }
};

export const server_Delete_controller = async (req, res, next) => {
  try {
    const { id } = req.params;
    if (!id) throw new ApiError(404, "Server id not exists");

    const serverDelete = await serverModel.findByIdAndDelete(id);

    return res
      .status(200)
      .json(new ApiResponse(200, serverDelete, "Server delete Successfully"));
  } catch (error) {
    console.log(error);
    next(error);
  }
};

export const serverJoin = async (req, res, next) => {
  try {
    const { inviteCode } = req.params;

    const server = await serverModel.findOne({ inviteCode });

    if (!server) throw new ApiError(404, "server not found");

    const user = await userModel.findById(req.user.id);

    if(!user) throw new ApiError(404,"user not found")

    const alreadyExist = (user.server || []).some(
      (serverId) => serverId.toString() === server._id.toString(),
    );

    if (alreadyExist)
      throw new ApiError(400, "You are already a Member of this server");

    const memberRole = await roleModel.findOne({
      server: server._id,
      name: "member",
    });

    if (!memberRole) {
      throw new ApiError(404, "Member role not found");
    }

    await createServerMember(req.user.id, server._id, [memberRole._id]);

    return res
      .status(200)
      .json(new ApiResponse(200, server, "Server joined Successfully"));
  } catch (error) {
    next(error);
  }
};
