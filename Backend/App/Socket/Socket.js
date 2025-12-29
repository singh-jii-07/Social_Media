import express from "express";
import http from "http";
import { Server } from "socket.io";

const app = express();
const server = http.createServer(app);

const io = new Server(server, {
  cors: {
    origin: "http://localhost:5173", // frontend
    methods: ["GET", "POST"],
  },
});

// 👇 socket logic
const userSocketMap = {};

io.on("connection", (socket) => {
  const userId = socket.handshake.query.userId;

  console.log("Socket connected:", socket.id, "User:", userId);

  if (userId) {
    userSocketMap[userId] = socket.id;
  }

  socket.on("disconnect", () => {
    console.log("Socket disconnected:", socket.id);
    if (userId) {
      delete userSocketMap[userId];
    }
  });
});

export const getReceiverSocketId = (receiverId) =>
  userSocketMap[receiverId];

export { app, server, io };
