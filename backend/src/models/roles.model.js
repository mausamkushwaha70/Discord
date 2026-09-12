import mongoose, { Types } from "mongoose";

const role_Schema = new mongoose.Schema(
  {
    
    name:{
      type:String,
      required:true
    },

    user:{
      type:mongoose.Schema.Types.ObjectId,
      ref:"user"
    },

    server: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "server",
    },

    permissions: {
      type: [String],
      default: [],
    },

    position:{
      type:Number,
      default:0,
    },

    color: {
      type: String,
      default: "#dadada",
    },
  },
  { timestamps: true },
);

const roleModel = mongoose.model("role",role_Schema);
export default roleModel;
