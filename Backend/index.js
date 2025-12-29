import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import mongoose from "mongoose";
import userRoutes from "./App/Routes/UserRoutes.js";
import Postrouter from "./App/Routes/PostRoutes.js";
import messageRoutes from "./App/Routes/MessageRoutes.js";
import cookieParser from "cookie-parser";
import { app, server } from "./App/Socket/Socket.js";

// const app = express();
dotenv.config();

app.use(express.json());
app.use(cookieParser());
const allowedOrigins = ["http://localhost:5173"];

app.use(
  cors({
    origin: function (origin, callback) {
      if (!origin || allowedOrigins.includes(origin)) {
        callback(null, true);
      } else {
        callback(new Error("Not allowed by CORS"));
      }
    },
    credentials: true,
  })
);
app.use((err, req, res, next) => {
  if (err instanceof multer.MulterError) {
    return res.status(400).json({
      success: false,
      message:
        err.message === "File too large"
          ? "Image size must be less than 5MB"
          : err.message,
    });
  }

  if (err) {
    return res.status(500).json({
      success: false,
      message: err.message,
    });
  }

  next();
});

app.use("/api/users", userRoutes);
app.use("/api/post", Postrouter);
app.use("/api/message", messageRoutes);

const PORT = process.env.PORT || 5000;
const MONGO_URI = process.env.MONGO_DB;

if (!MONGO_URI) {
  console.error("Mongo URI not found. Check your .env file (MONGO_DB)");
  process.exit(1);
}

mongoose
  .connect(MONGO_URI)
  .then(() => {
    console.log("Mongoose is connected");

    app.get("/", (req, res) => {
      res.send("Welcome to Social_Media API");
    });

    server.listen(5000, () => {
      console.log("Server + Socket running on port 5000");
    });
  })
  .catch((err) => {
    console.log("DB connection failed", err);
  });
