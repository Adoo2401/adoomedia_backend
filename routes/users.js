import express from 'express';
import { addRemoveFriend, getUser, getUserFriends } from '../controllers/users.js';
import { verifyToken } from '../middlewares/auth.js';

let router=express.Router();

/* GET */ 
router.route('/:id').get(verifyToken,getUser);
router.route("/:id/friends").get(verifyToken,getUserFriends);


/* UPDATE */
router.route("/:id/:friendId").patch(verifyToken,addRemoveFriend);



export default router;