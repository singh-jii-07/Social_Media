import express from "express";
import isAuthenticated from "../Middleware/isAuthenticated.js";
import upload from "../Middleware/Multer.js"; 
import {
  addNewPost,
  getAllPost,
  getUserPost,
  likePost,
  dislikePost,
  addComment,
  getCommentsOfPost,
  deletePost,
  bookmarkPost,
} from "../Controllers/PostController.js";

const PostRouter = express.Router();

PostRouter.post("/addpost",isAuthenticated, upload.single('image'), addNewPost);
PostRouter.get ("/getpost",isAuthenticated,getAllPost);
PostRouter.get ("/getpostuser/:id",isAuthenticated, getUserPost);
PostRouter.get ("/like/:id",isAuthenticated, likePost);
PostRouter.get ("/dislike/:id",isAuthenticated, dislikePost);
PostRouter.post ("/comment/:id",isAuthenticated, addComment);
PostRouter.post ("/comment/all/:id",isAuthenticated, getCommentsOfPost);
PostRouter.delete ("/delete/:id",isAuthenticated, deletePost);
PostRouter.get ("/bookmark/:id",isAuthenticated, bookmarkPost);

export default PostRouter;