import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import User from '../models/User.js';
import formatBufferTo64 from '../utils/formatBufferTo64.js';
import cloudinary from 'cloudinary'


/* REGISTER */

export const register=async(req,resp)=>{
    try {
    
        const {firstName,lastName,email,password,friends,location,occupation}=req.body;

        let emailCheck=await User.findOne({email});

        if(emailCheck) return resp.status(500).json({success:false,code:"duplicateemail"});

        const salt=await bcrypt.genSalt();
        const passwordHash=await bcrypt.hash(password,salt);

        const file64=formatBufferTo64(req.file);
        
        const uploadResult=await cloudinary.v2.uploader.upload(file64.content,{folder:"users"});
        const newUser=new User({firstName,lastName,email,password:passwordHash,picturePath:uploadResult,friends,location,occupation,viewedProfile:Math.floor(Math.random()*10000),impressions:Math.floor(Math.random()*10000)})
        const savedUser=await newUser.save();

        resp.status(201).json({success:true,message:savedUser});

    } catch (error) {
        resp.status(500).json({success:false,message:error.message,code:"duplicateemail"});
    }
}

/* LOGIN */

export const login=async(req,resp)=>{
    try {
        
        const {email,password}=req.body;
        
        const user=await User.findOne({email});

        if(!user) return resp.status(400).json({success:false,message:"Email or password are incorrect"});

        const isMatch=await bcrypt.compare(password,user.password);

        if(!isMatch) return resp.status(400).json({success:false,message:"Email or password are incorrect"});

        const token=jwt.sign({_id:user._id},process.env.JWT_SECRET);
        delete user.password;

        resp.status(200).json({success:true,message:{token,user}})

    } catch (error) {
      resp.status(500).json({error:error.message});
    }
}