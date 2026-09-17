import mongoose from "mongoose";

const channelSchema = new mongoose.Schema(
  {
    channelName: {
      type: String,
      required: true,
      trim: true,
      minlength: 5,
      maxlength: 50,
    },
    channelType: {
      type: String,
      enum: ["text", "voice"],
      default: "text",
    },
    server: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "server",
      required: true,
    },
    position: {
      type: Number,
      default: true,
    },
    isPrivate: {
      type: Boolean,
      default: false,
    },
  },
  { timestamps: true },
);

const channelModel = mongoose.model("channel", channelSchema);
export default channelModel;
