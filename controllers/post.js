import cloudinary from 'cloudinary'
import Post from "../models/Post.js";
import User from '../models/User.js';
import formatBufferTo64 from "../utils/formatBufferTo64.js";


export const uploadPost=async(req,resp)=>{
    try {
        
        const {description}=req.body;

        const user=await User.findById(req.user._id);

        const file64=formatBufferTo64(req.file);

        const uploadResult=await cloudinary.v2.uploader.upload(file64.content,{folder:"posts"});

        const newPost=new Post({
            userId:req.user._id,
            firstName:user.firstName,
            lastName:user.lastName,
            location:user.location,
            description,
            userPicturePath:user.picturePath.url,
            picturePath:uploadResult,
            likes:{},
            comments:[]
        })

        await newPost.save();

        const posts=await Post.find();

        return resp.status(200).json({success:true,message:posts})

    } catch (error) {
        resp.status(500).json({success:false,message:error.message});
    }
}


export const getFeedPosts=async(req,resp)=>{
    try {
        
      const posts=await Post.find();
      resp.status(200).json({posts})

    } catch (error) {
        resp.status(500).json({msg:error.message});        
    }
}

export const getUserPosts=async(req,resp)=>{
    try {
        
     const posts=await Post.find({userId:req.params.userId});
     resp.status(200).json({posts})

    } catch (error) {
        resp.status(500).json({msg:error.message});
    }
}

export const likePost=async(req,resp)=>{
    try {
        
       const {id}=req.params;
       const {userId}=req.body;

       const post=await Post.findById(id);
       const isLiked=post.likes.get(userId);

       if(isLiked){
         post.likes.delete(userId)
       }else{
        post.likes.set(userId,true);
       }

       const updatedPost=await Post.findByIdAndUpdate(id,{likes:post.likes},{new:true});
       resp.status(200).json(updatedPost);

    } catch (error) {
        resp.status(500).json({msg:error.message});
    }
}