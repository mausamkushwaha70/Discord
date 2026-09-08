import serverMember_Model from "../models/serverMember.model.js";

export const createServerMember = async (userId, serverId, roles = []) => {
  console.log(serverId, userId);
  return await serverMember_Model.create({
    user: userId,
    server: serverId,
    roles,
  });
};


