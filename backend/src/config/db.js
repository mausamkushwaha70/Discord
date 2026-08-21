import mongoose from "mongoose";


export const DbConnect = async () => {
  await mongoose.connect("mongodb://localhost:27017/Discord");
  console.log("DB connected");
};
