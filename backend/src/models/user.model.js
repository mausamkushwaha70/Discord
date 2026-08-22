import mongoose from "mongoose";
import bcrypt, { compare } from "bcrypt";

const userSchema = new mongoose.Schema(
  {
    username: {
      type: String,
      required: [true, "userName is required"],
      trim: true,
      minlength: 3,
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

userSchema.pre("save", function () {
  if (this.isModified("password")) {
    return this.password = bcrypt.hashSync(this.password, 10);
  }
});

userSchema.methods.comparePass = function (password){
    return bcrypt.compareSync(password, this.password)
}


const userModel = mongoose.model("user", userSchema);
export default userModel;
