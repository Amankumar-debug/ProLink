import dotenv from "dotenv";
dotenv.config();
import express from "express";
import mongoose from "mongoose";
import cors from "cors";
import userRoute from "./routes/userRoute.js";
import postRoute from "./routes/post.routes.js";
import { link } from "node:fs";

const mongodb_url=process.env.MONGO_URL;


const app=express();
app.use(cors());
app.use(express.json({limit:"40kb"}));
app.use(express.static("uploads"));
app.use(express.urlencoded({limit:"40kb",extended:true}));

app.use(userRoute);
app.use(postRoute);

app.get("/",(req,res)=>{
    res.send("home");
})





const start=async()=>{
    const connectiontodb=await mongoose.connect(mongodb_url);
    console.log("connect to DB 😊🎉");
app.listen(8000,()=>{
    console.log("App is running to port 8000 👌🎉🎊🎇");
})
}


start();