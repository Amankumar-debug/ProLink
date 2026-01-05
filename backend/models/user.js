import mongoose from "mongoose";
import { type } from "os";
import { PassThrough } from "stream";
const Schema=mongoose.Schema;

const userSchema=new Schema({
    name:{
        type:String,
        required:true,
    },
    username:{
        type:String,
        required:true,
        unique:true,
    },  
    email:{
        type:String,
        required:true,
        unique:true,
    },
    active:{
        type:Boolean,
        default:true,
    },
    password:{
        type:String,
        required:true
    },
    profilePicture:{
        type:String,
        default:"default.jpg"
    },
    crratedAt:{
        type:Date,
        default:Date.now
    },
    token:{

        type:String,
        default:''
    }

});

const User=mongoose.model("User",userSchema);

export {User};
