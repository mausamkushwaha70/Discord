import mongoose from "mongoose";


const userSchema = new mongoose.Schema(
    {
        username: {
            type: String,
            required: [true, "userName is required"],
            trim: true,
            minlength: 5,
            maxlength: 20,
            unique: true,
        },

        fullName: {
            type: String,
            required: [true, "Name is required"],
            minlength: 5,
            maxlength: 50,
            trim: true,
        },

        email: {
            type: String,
            required: [true, "email is required"],
            unique: true,
        },

        password: {
            type: String,
            required: [true, "Password is required"],
            minlength: 6,
        },

        dob: {
            type: Date,
        },

        phone: {
            type: String,
            unique: true,
            sparse: true,
        },

        profile_pic: {
            type: String,
        },

        googleId: {
            type: String,
            unique: true,
            sparse: true,
        },

        authProvider: {
            type: String,
            enum: ["local", "google"],
            default: "local",
        },

        server: [
            {
                type: mongoose.Schema.Types.ObjectId,
                ref: "servers",
            },
        ],

        friends: [
            {
                type: mongoose.Schema.Types.ObjectId,
                ref: "users",
            },
        ],
    },
    {
        timestamps: true,
    },
);







const userModel = mongoose.Model("user",userSchema)
export default userModel;
