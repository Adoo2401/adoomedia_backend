import mongoose from 'mongoose';

const UserSchema=new mongoose.Schema(
    {
        firstName:{
            type:String,
            required:true,
            min:2,                  //minimun two characters
            max:50                  //maximum 50 characters
        },

        lastName:{
            type:String,
            required:true,
            min:2,                  
            max:50                  
        },

        email:{
            type:String,
            required:true,
            unique:true,         //So that the email should be unique      
            max:50                  
        },

        password:{
            type:String,
            required:true,
            min:5                  
        },

        picturePath:{
            type:Object,
            default:"",
        },

        friends:{
            type:Array,
            default:[]
        },

        location:String,
        occupation:String,
        viewedProfile:Number,
        impressions:Number
    }
    ,{timestamps:true}
)

const User=mongoose.model("User",UserSchema);
export default User;