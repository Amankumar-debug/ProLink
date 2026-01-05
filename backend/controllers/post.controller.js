import Post from "../models/posts.model.js";
import { User } from "../models/user.js";
import Comment from "../models/comment.model.js";



export const createPost=async(req,res)=>{
    const {token}=req.body;
   

    try {

        const user=await User.findOne({token});
        console.log(user);
        if(!user){
            return res.status(404).json({message:"user not found"});
        }
        console.log(user._id);
        const post=new Post({
            userId:user._id,
            body:req.body.body,
            media:req.file!=undefined?req.file.filename:'',
            fileType:req.file!=undefined?req.file.mimetype.split('/')[1]:'',
        })

        await post.save();
        return res.status(200).json({message:"post created successfully"});
        
    } catch (error) {
        res.status(500).json({message: `some error occured ${error}`});
    }
}

export const getAllPost=async(req,res)=>{
    try {
       const posts=await Post.find({active:true})
       .populate("userId","name email username profilePicture");
       res.status(200).json(posts);
    } catch (error) {
        res.status(500).json({message: `some error occured ${error}`});
    }
}

export const deletePost=async (req,res) => {
    const {token, post_id}=req.body;
    console.log(token, post_id);
    try {

        const user=await User.findOne({token}).select("_id");
        if(!user){
            return res.status(404).json({message:"user not found"});
        }

        const post=await Post.findOne({_id:post_id});
        if(!post){
            return res.status(404).json({message:"post not found"});
        }

        if(post.userId.toString()!==user._id.toString()){
            return res.status(403).json({message:"you are not authorized to delete this post"});
        }

        // await Post.deleteOne({_id:post_id});
        
        post.active=false;
        await post.save();
        return res.status(200).json({message:"post deleted successfully"});
        
    } catch (error) {
        res.status(500).json({message: `some error occured ${error}`});
    }
}


export const commentPost=async(req,res)=>{
    const {token,post_id,commentBody}=req.body;

    try {
        
        const user=await User.findOne({token}).select("_id");
        if(!user){
            return res.status(404).json({message:"user not found"});
        }

        const post=await Post.findOne({_id:post_id});
        if(!post){
            return res.status(404).json({message:"post not found"});
        }

        const comment=new Comment({
        userId:user._id,
        postId:post_id,
        body:commentBody
        })

        await comment.save();
        return res.status(200).json({message:"comment added successfully"});
    } catch (error) {
        return res.status(500).json({message:`something went wrong ${error}`});
    }
}


export const getCommentsByPost=async(req,res)=>{
    const {post_id}=req.query;
    try {

        const post=await Post.findOne({_id:post_id});
        if(!post){
            return res.status(404).json({message:"post not found"});
        }

        const comments=await Comment.find({postId:post_id})
        .populate("userId","username name profilePicture")
        return res.status(200).json(comments.reverse())
        
    } catch (error) {
        return res.status(500).json({message:`something went wrong ${error}`});
    }
}


export const deleteCommentOfUser=async(req,res)=>{
    const {token, comment_id}=req.body;

    try {
        
        const user=await User.findOne({token}).select("_id");
        if(!user){
            return res.status(404).json({message:"user not found"});
        }

        const comment=await Comment.findOne({_id:comment_id});  
        if(!comment){
            return res.status(404).json({message:"comment not found"});
        }

        if(comment.userId.toString()!==user._id.toString()){
            return res.status(403).json({message:"you are not authorized to delete this comment"});
        }

        await Comment.deleteOne({_id:comment_id});
        return res.status(200).json({message:"comment deleted successfully"});

    } catch (error) {
        return res.status(500).json({message:`something went wrong ${error}`});
    }
}


export const incrementLikes=async(req,res)=>{
    const {post_id}=req.body;

    try {
        
        const post=await Post.findOne({_id:post_id});
        if(!post){
            return res.status(404).json({message:"post not found"});
        }   
        post.likes+=1;
        await post.save();
        return res.status(200).json({message:"like added successfully"});
    } catch (error) {
        return res.status(500).json({message:`something went wrong ${error}`});
    }
}
