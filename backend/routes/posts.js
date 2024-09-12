import express from "express";
import { getPosts, getUserPosts, favouritePost } from "../controllers/posts.js";
import { isAuthenticatedUser } from "../middleware/auth.js";

const router = express.Router();

/* READ */
router.get("/", getPosts);
router.get("/:userId", getUserPosts);

/* UPDATE */
router.patch("/:id/favourite", favouritePost);

export default router;