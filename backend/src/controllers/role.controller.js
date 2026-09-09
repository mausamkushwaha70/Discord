import roleModel from "../models/roles.model";
import serverModel from "../models/server.model.js"
import ApiError from "../utils/apiError.util.js";
import ApiResponse from "../utils/apiResponse.util.js";

export const createRole = async (req, res, next) =>{
    try {
        const {serverId} = req.params;

        const {name,permissions, color, position} = req.body;
        
        const server = await serverModel.findById(serverId);
        if(!server) throw new ApiError(404,"Server not found")

        if(server.owner.toString()!==req.user.id.toString()){
            throw new ApiError(403,"Only server owner can Create roles")
        };

        const role = await roleModel.create({
            name,
            server:serverId,
            permissions,
            color,
            position
        });
        return res.status(200).json(
            new ApiResponse(200, role, "role created seucessfully")
        )
    } catch (error) {
        console.log(error)
        next(error)

    }
}