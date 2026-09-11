import mongoose from "mongoose";

const serverMember_Schema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "user",
    },

    server: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "server",
    },

    roles: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "role",
      },
    ],
  },
  {
    timestamps: true,
  },
);

const serverMember_Model = mongoose.model("member", serverMember_Schema);
export default serverMember_Model;
