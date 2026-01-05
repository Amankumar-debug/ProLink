import { client } from "@/config";
import { createAsyncThunk } from "@reduxjs/toolkit";




export const getAllPosts=createAsyncThunk(
    'post/getAllPosts',
    async(_,thunkAPI)=>{
        try {

            const posts=await client.get("/posts");

            return thunkAPI.fulfillWithValue(posts.data);
            
        } catch (error) {
            return thunkAPI.rejectWithValue(error.response.data);
        }
    }
)

export const createPost=createAsyncThunk(
    'post/createPost',
    async(userData,thunkAPI)=>{
        const {file,body}=userData;
        try {

            const formData=new FormData();
            formData.append('token',localStorage.getItem("token"));
            formData.append('body',body);
            formData.append('media',file);
     console.log("post")
            const response=await client.post("/post",formData,{
                'Content-type':'multpart/form-data'
            })

            if(response.status==200){
                return thunkAPI.fulfillWithValue("post created")
            }else{
                return thunkAPI.rejectWithValue("post not created")
            }
            
        } catch (error) {
            return thunkAPI.rejectWithValue(error.response.data);
        }
    }
)

export const deletePost=createAsyncThunk(
    'post/deletePost',
    async(post_id,thunkAPI)=>{
        try {

            const response=await client.post("/delete_post",{
                
                    token:localStorage.getItem("token"),
                    post_id:post_id.post_id
                
            })

            return thunkAPI.fulfillWithValue(response.data);
            
        } catch (error) {
            return thunkAPI.rejectWithValue(error.response.data);
        }
    }
)

export const increaseLikes=createAsyncThunk(
    'post/increaseLikes',
    async(post,thunkAPI)=>{
        try {

            const response=await client.post("/increment_post_likes",{
                post_id:post.post_id
            })

            
        } catch (error) {
            return thunkAPI.rejectWithValue(error.response.data);
        }
    }
)

export const getAllComments=createAsyncThunk(
    'post/getAllComments',
    async(post_id, thunkAPI)=>{
        try {

            const response=await client.get("/get_comments",{
                params:{
                    post_id:post_id.post_id
                }
               
            })
           
            return thunkAPI.fulfillWithValue({
                
                comments:response.data,
                post_id:post_id.post_id
            });

        } catch (error) {
            return thunkAPI.rejectWithValue(error.response.data);
        }
    }
)

export const postComment=createAsyncThunk(
    'post/postComment',
    async(comment, thunkAPI)=>{
        try {

            const response=await client.post("/comment",{
                token:localStorage.getItem("token"),
                post_id:comment.post_id,
                commentBody:comment.body
            })

            return thunkAPI.fulfillWithValue(response.data);

        } catch (error) {
            return thunkAPI.rejectWithValue(error.response.data);
        }
    }   
)


export const deleteComment=createAsyncThunk(
    'post/deleteComment',
    async(comment,thunkAPI)=>{
        try {

            const response=await client.post("/delete_comment",{
                token:localStorage.getItem("token"),
                comment_id:comment.comment_id
            })

            return thunkAPI.fulfillWithValue(response.data);

        } catch (error) {
            return thunkAPI.rejectWithValue(error.response.data);
        }
    }
)