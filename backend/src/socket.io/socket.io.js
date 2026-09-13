import { server } from "../app.js";
import { Server } from "socket.io";

export const initializeSocket = (server) => {
  const io = new Server(server);
  io.on("connection", (socket) => {
    console.log("user connected", socket.id);
    
    socket.on("disconnect", () => {
      console.log("user disconnected", socket.id);
    });
  });
};
