import express from "express";
import isAuthenticated from "../Middleware/isAuthenticated.js";
import {
  register,
  login,
  logout,
  getProfile,
  editProfile,
  getSuggestedUsers,
  followOrUnfollow,
} from "../Controllers/UserController.js";

import upload from "../Middleware/Multer.js";
const userRoutes = express.Router();

userRoutes.post("/register", register);
userRoutes.post("/login", login);
userRoutes.post("/logout", logout);
userRoutes.get("/profile/:id", isAuthenticated, getProfile);
userRoutes.post(
  "/profile/edit",
  isAuthenticated,
  upload.single("profilePhoto"),
  editProfile
);
userRoutes.get("/suggested", isAuthenticated, getSuggestedUsers);
userRoutes.post("/followorunfollow/:id", isAuthenticated, followOrUnfollow);
export default userRoutes;
