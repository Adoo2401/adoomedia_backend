import express from 'express';
import { getFeedPosts, getUserPosts, likePost, uploadPost } from '../controllers/post.js';
import { verifyToken } from '../middlewares/auth.js';

let router=express.Router();

router.route("/").get(verifyToken,getFeedPosts);
router.route("/:userId/posts").get(verifyToken,getUserPosts);
router.route("/:id/like").patch(verifyToken,likePost);


export default router;