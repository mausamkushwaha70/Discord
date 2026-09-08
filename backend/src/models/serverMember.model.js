import mongoose from "mongoose";

const serverMember_Schema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "users",
    },

    server: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "servers",
    },

    roles: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "roles",
      },
    ],
  },
  {
    timestamps: true,
  },
);

const serverMember_Model = mongoose.model("member", serverMember_Schema);
export default serverMember_Model;
