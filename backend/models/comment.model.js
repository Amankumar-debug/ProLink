import mongoose from "mongoose";
import { User } from "./user.js";  
import Post from "./posts.model.js";   

const commentSchema=new mongoose.Schema({
    userId:{
        type:mongoose.Schema.Types.ObjectId,
        ref:"User"
    },
    postId:{
        type:mongoose.Schema.Types.ObjectId,
        ref:"Post",

    },
    body:{
        type:String,
        required:true,
    }
});

const Comment=mongoose.model("Comment",commentSchema);

export default Comment;