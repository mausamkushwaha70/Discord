import serverModel from "../models/server.model.js";
import { sendFile } from "../services/storage.service.js";
import ApiError from "../utils/apiError.util.js";
import ApiResponse from "../utils/apiResponse.util.js";
import { generateInviteCode } from "../utils/inviteCode.util.js";

export const createServer = async (req, res, next) => {
  try {
    const { name, description, isPublic } = req.body;
    const icon = req.files.icon;
    const banner = req.files.banner;

    if (!name || !description) {
      return res.status(400).json({
        success: false,
        message: "name and description are required",
      });
    }

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
      owner: req.user._id,
      icon: uploadIcon?.url || "",
      banner: uploadBanner?.url || "",
      isPublic,
      inviteCode,
    });
    console.log(server);

    return res
      .status(201)
      .json(new ApiResponse(201, server, "Server created successfully"));
  } catch (error) {
    console.log(error.message);
  }
};

export const getServer_Controller = async (req, res, next) => {
  try {
    const { id } = req.params;
    const server = await serverModel.findById(id);

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

// debouncing use in search user........

// create server
// getAll server
// update server
// delete server

// generate INviteCode
// join server
// -data by params
// -find server on the basis of invite code
// -throw error
// -check is exist
// leave server
// serrch server

const joinServer = async (req, res, next) => {
  try {
    const { inviteCode } = req.params;
    const server = await serverModel.findOne({ inviteCode });
    if (!inviteCode) throw new ApiError(404, "invalid invite code ");
    const alreadyExist = user.server.some((serverId) => {
      user.server.serverId.toString() === server.id.toString();
    });

    if (alreadyExist) throw new ApiError(409);
  } catch (error) {}
};
