import express from 'express';
import bodyParser from 'body-parser'
import mongoose from 'mongoose';
import dotenv from 'dotenv';
import helmet from 'helmet';
import morgan from 'morgan';
import multer from 'multer';
import authRoutes from './routes/auth.js'
import userRoutes from './routes/users.js'
import postRoutes from './routes/postRoutes.js';
import {register} from './controllers/auth.js'
import cloudinary from 'cloudinary';
import cors from 'cors';
import path from 'path';
import User from './models/User.js';
import Post from './models/Post.js';
import {users,posts} from './data/index.js'
import {fileURLToPath} from 'url'
import { verifyToken } from './middlewares/auth.js';
import { uploadPost } from './controllers/post.js';


const ALLOWED_FORMATS=['image/jpeg','image/png','image/jpg'];

/* CONFIGURATIONS */

const __filename=fileURLToPath(import.meta.url);  //This configuration is so that we can grab the file URL and it's specificaly when you use type module
const __dirname=path.dirname(__filename);        //This one and above one just for when we use type module

dotenv.config({path:".env"});

  cloudinary.config({ 
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME, 
    api_key: process.env.CLOUDINARY_API_KEY, 
    api_secret: process.env.CLOUDINARY_API_SECRET 
  });

const app=express();
app.use(express.json());
app.use(helmet());                                                           //Going to put additional level of security to our applications by adding some usefull Headers
app.use(helmet.crossOriginResourcePolicy({policy:'cross-origin'}));
app.use(morgan('common'));
app.use(bodyParser.json({limit:"30mb",extended:true}));
app.use(bodyParser.urlencoded({limit:"30mb",extended:true}));
app.use(cors())


                                                                              //Difference between Authentication and authorization is basically when you register and then login that's authentication, authorization is when you want to make sure someone's logged in so you can perform certain operations
/* FILE STORAGE */

let fileTypeCheck=false;
const storage=multer.memoryStorage();
const upload=multer({
  storage,
  fileFilter:function(req,file,cb){
          if(ALLOWED_FORMATS.includes(file.mimetype)){
            cb(null,true);                                                 //Specifing the type of memory storage. Images will be stored in memory only for a period of time while serving the request.
          }else{
            fileTypeCheck=true;
            cb(new Error("Not Supported File Type"),false);
          }

  }
})

const singleUpload=upload.single("picture");
const singleUploadCtrl=(req,resp,next)=>{
  
  
  singleUpload(req,resp,(error)=>{
    if(error){
      return resp.status(422).json({success:false,message:fileTypeCheck?"Upload only jpg, jpeg, png files":"Image Upload Failed",error:error})
    }
    next();
  })
  
}

/* ROUTES WITH FILES */

app.post('/auth/register',singleUploadCtrl,register)
app.post("/posts",verifyToken,singleUploadCtrl,uploadPost)


/* ROUTES */

app.use('/auth',authRoutes)
app.use('/users',userRoutes)
app.use("/posts",postRoutes);



/* MONGODB SETUP */

const PORT=process.env.PORT || 6000;

mongoose.set("strictQuery",true)
mongoose.connect(process.env.MONGO_URL).then(()=>{

  app.listen(PORT,()=>console.log(`Server is working on PORT ${PORT}`))
  

}).catch((err)=>console.log(`${err} did not connect`))

