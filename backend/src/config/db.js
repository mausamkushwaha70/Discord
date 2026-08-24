import mongoose from "mongoose";


export const DbConnect = async () => {
  try {
    await mongoose.connect("mongodb://localhost:27017/Discord");
    console.log("DB connected");
  } catch (error) {
    console.log(error);
  }
};
