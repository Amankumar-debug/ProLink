import { User } from "../models/user.js";
import httpStatus from "http-status";
import bcrypt from "bcrypt";
import crypto from "crypto";
import Profile from "../models/profile.model.js";
import PDFDocument from "pdfkit";
import fs from "fs";
import ConnectionRequest from "../models/connections.model.js";

const convertUserDataToPDF=async(userData)=>{
    const doc=new PDFDocument();

    const outPutPath=crypto.randomBytes(32).toString("hex")+".pdf";
    const stream=fs.createWriteStream("uploads/"+outPutPath);

    doc.pipe(stream);

    doc.image(`uploads/${userData.userId.profilePicture}`,{align:"center",width:100});
    doc.fontSize(14).text(`Name: ${userData.userId.name}`,);
    doc.fontSize(14).text(`Username: ${userData.userId.username}`);
    doc.fontSize(14).text(`Email: ${userData.userId.email}`);
    doc.fontSize(14).text(`Bio: ${userData.bio}`);
    doc.fontSize(14).text(`current Position: ${userData.currentPost}`);

    doc.fontSize(14).text("Past Work: ")
    userData.pastWork.forEach((work,index)=>{
        doc.fontSize(14).text(`Company Name: ${work.company}`);
        doc.fontSize(14).text(`Position: ${work.position}`);
        doc.fontSize(14).text(`Years: ${work.years}`);
    })
  doc.end();

  return outPutPath;

}




const userSignUp=async(req,res)=>{
    const {name,email,password,username}=req.body;
    if(!name||!email||!password||!username){
        return res.status(400).json({message:"Please provide data"});
    }
    try {
        const exist= await User.findOne({email});
        if(exist){
        return res.status(httpStatus.FOUND).json({message:"user already exist"});
        }

        const hasedPassword=await bcrypt.hash(password,10);
        
        const newUser=new User({
            name:name,
            email:email,
            password:hasedPassword,
            username:username,
        })

        await newUser.save();
        const profile=new Profile({userId:newUser._id});
        await profile.save();
        return res.status(httpStatus.CREATED).json({message:"Registerd successfully"});
    } catch (e) {
        res.json({message:`somthing went wrong ${e}`});
    }
}

const userLogin=async(req,res)=>{
    const{email,password}=req.body;
    if(!email||!password){
        return res.status(400).json({message:"Please provide data"});
    }
    try {
        const user= await User.findOne({email});
        console.log(req.body);
        if(!user){
            return res.status(httpStatus.NOT_FOUND).json({message:"user not found"});
        }
      
        let isPasswordCorrect=await bcrypt.compare(password,user.password);
        if(isPasswordCorrect){
            let token=crypto.randomBytes(32).toString("hex");
            user.token=token;
            await user.save();
            return res.status(httpStatus.OK).json({token:token});
        }else{
            return res.status(httpStatus.UNAUTHORIZED).json({message:"incorrect password or email"});
        }

        
    } catch (e) {
        return res.status(500).json({message:`something went wrong ${e}`});
    }
}


const uploadProgilePicture=async(req,res)=>{
    const {token}=req.body;
    
    try {
      const user=await User.findOne({token:token});
      if(!user){
        return res.status(404).json({message:"user not found"})
      }
      user.profilePicture=req.file.filename;
      await user.save();
      return res.status(httpStatus.OK).json({message:"profile picture updated successfully"});
      
        
    } catch (error) {
        res.status(500).json({message:`something went wrong ${error}`});
    }
}

const updateUserProfile=async(req,res)=>{
    const{token,...newUserData}=req.body;
    try {
        const user=await User.findOne({token:token});
        if(!user){
            return res.status(404).json({message:"user not found"});
        }
        const {email,username}=newUserData;

        const existingUser=await User.findOne({$or:[{eamil},{username}]})

        if(existingUser && existingUser._id.toString()!==user._id.toString()){
            return res.status(400).json({message:"user already exist"});
        }

        Object.assign(user,newUserData);

        await user.save();
        return res.status(200).json({message:"user profile updated successfully"});
        
    } catch (error) {
        return res.status(500).json({message:`something went wrong ${error}`});
    }
}

export const getUserAndProfile=async(req,res)=>{
   try {

    const{token}=req.query;
    const user=await User.findOne({token});
    if(!user){
        return res.status(400).json({message:"user not found"});
    }
     const userProfile=await Profile.findOne({userId:user._id})
     .populate("userId","name username email profilePicture");

     return res.json({"profile":userProfile});

    
   } catch (error) {
    return res.status(500).json({message:`something went wrong ${error}`});
   }
}

export const updateUserData=async(req,res)=>{
    try {
        const {token,...newProfileData}=req.body;
        const user=await User.findOne({token});
        if(!user){
            return res.status(400).json({message:"user not found"});
        }

        const userProfile=await Profile.findOne({userId:user._id});

        Object.assign(userProfile,newProfileData);

        await userProfile.save();
        return res.status(200).json({message:"profile updated successfully"});
    } catch (error) {
        return res.status(500).json({message:`something went wrong ${error}`});
    }
}
 

export const getAllUserProfile=async(req,res)=>{
    try {
        
        const profiles=await Profile.find().
        populate("userId","name username email profilePicture");
        return res.json({profiles});
    } catch (error) {
        return
    }
}

export const downloadProfile=async(req,res)=>{
    try {
         
        const user_id=req.query.id;
        const profile=await Profile.findOne({userId:user_id}).
        populate("userId","name username email profilePicture");

        const outPutPath=await convertUserDataToPDF(profile);


        return res.json({"message":outPutPath});

    } catch (error) {
        return res.status(500).json({message:`something went wrong ${error}`});
    }
}



export const sendConnectionRequest=async(req,res)=>{
    const {token, connectionId}=req.body;
    try {
         
        const user=await User.findOne({token});
        if(!user){
            return res.status(404).json({message:"user not found"});
        }

        const connectionUser=await User.findOne({_id:connectionId});
        if(!connectionUser){
            return res.status(404).json({message:"connection user not found"});
        }

        const existingRequest=await ConnectionRequest.findOne({
            userId:user._id,
            connectionId:connectionUser._id
        });
        if(existingRequest){
            return res.status(400).json({message:"Requst alrerady sent"});
        }

        const requst=new ConnectionRequest({
            userId:user._id,
            connectionId:connectionUser._id
        });
        await requst.save();

        return res.status(200).json({message:"Request sent"});
    } catch (error) {
        res.status(500).json({message:`something went wrong ${error}`});
    }
}


export const getMyConnectionRequests=async(req,res)=>{
    const {token}=req.query;

    try {
    
        const user=await User.findOne({token});
        if(!user){
            return res.status(404).json({message:"user not found"});
        };

        const connections=await ConnectionRequest.find({userId:user._id})
        .populate("connectionId","name username email profilePicture")
         .populate("connectionId", "name username email profilePicture");
        return res.status(200).json({connections});
        
    } catch (error) {
        res.status(500).json({message:`something went wrong ${error}`});
    }
}

export const WhatAreMyConnections=async(req,res)=>{
    const {token}=req.query;

     try {
        
        const user=await User.findOne({token});
        if(!user){
            return res.status(404).json({message:"user not found"});
        };

        const connections=await ConnectionRequest.find({connectionId:user._id})
        .populate("userId","name username email profilePicture");

        return res.status(200).json({connections});

     } catch (error) {
        res.status(500).json({message:`something went wrong ${error}`});
     }
}


export const acceptConnectionRequest=async(req,res)=>{
    const {token,requestId, action_type}=req.body;

    try {
        
        const user=await User.findOne({token});
        if(!user){
            return res.status(404).json({message:"user not found"});
        };

        const connection=await ConnectionRequest.findOne({_id:requestId});

        if(!connection){
            return res.status(404).json({message:"connection request not found"});
        }

        if(action_type==="accept"){
            connection.status_accepted=true;
        
        }else{
            connection.status_accepted=false;
        }

        await connection.save();

        return res.status(200).json({message:"Request updated"});

    } catch (error) {
        res.status(500).json({message:`something went wrong ${error}`});
    }
}




export const getUserAndProfileBaesdOnUsername=async(req,res)=>{
    const {username}=req.query;
    try {

        const  user=await User.findOne({username});
        if(!user){
            return res.status(404).json({message:"user not found"});
        }
        const userProfile=await Profile.findOne({userId:user._id})
        .populate("userId", "name username email profilePicture");

        return res.status(200).json({"profile":userProfile});
        
    } catch (error) {
        return res.status(500).json({message:`something went wrong ${error}`});
    }
}


export {userSignUp,userLogin,uploadProgilePicture,updateUserProfile}; 