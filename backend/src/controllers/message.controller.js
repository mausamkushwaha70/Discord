import channelModel from "../models/channels.model";
import messageModel from "../models/message.model";
import { sendFile } from "../services/storage.service";


export const createMessage = async (req, res, next) => {
    try {
        const { channelId } = req.params;
        const { content } = req.body;

        const channel = await channelModel.findById(channelId);

        if (!channel) {
            throw new ApiError(404, "Channel not found");
        }

        const member = await serverModel.findOne({
            server: channel.server,
            user: req.user._id
        });

        if (!member) {
            throw new ApiError(
                403,
                "You are not a member of this server"
            );
        }

        // Check if message has either text or attachments
        if (
            (!content || !content.trim()) &&
            (!req.files || req.files.length === 0)
        ) {
            throw new ApiError(
                400,
                "Message must contain text or an attachment"
            );
        }

        // Upload attachments
        let attachments = [];

        if (req.files && req.files.length > 0) {
            attachments = await Promise.all(
                req.files.map(async (file) => {
                    const uploadedFile = await sendFile(
                        file.buffer,
                        file.originalname
                    );

                    return {
                        url: uploadedFile.url,
                        type: file.mimetype.startsWith("image/")
                            ? "image"
                            : file.mimetype.startsWith("video/")
                            ? "video"
                            : "file",
                        name: file.originalname
                    };
                })
            );
        }

        const message = await messageModel.create({
            content: content?.trim() || "",
            author_id: req.user._id,
            channel_id: channelId,
            attachments
        });

        const messageDetails = await messageModel.findById(message._id).populate("author_id","profile_pic username")

       const io = getIO()

       io.to(`channel:${channelId}`).emit(
        "message:new",messageDetails
       )
        return res.status(201).json(
            new ApiResponse(
                201,
               "message",
                "Message created successfully"
            )
        );
    } catch (error) {
        next(error);
    }
};