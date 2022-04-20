import express from "express";

import { getPosts, getPost, createPost, updatePost, deletePost, likePost, getPostsBySearch, commentPost } from "../controllers/posts.js"
import auth from "../middleware/auth.js";


const router = express.Router();

//http://localhost:4000/posts

router.get("/", getPosts);
router.get("/search", getPostsBySearch);
router.get("/:id", getPost);

router.post("/create", auth, createPost);
router.post("/:id/comment", auth, commentPost);
router.patch("/:id", auth, updatePost);
router.delete("/:id", auth, deletePost);
router.patch("/:id/like", auth, likePost)


export default router;