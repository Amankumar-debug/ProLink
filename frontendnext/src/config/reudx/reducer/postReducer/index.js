import { createSlice } from "@reduxjs/toolkit"// const { reset } = require("../authReducer")

import { getAllComments, getAllPosts } from "../../action/postAction"
import { act } from "react"



const initialState={
    posts:[],
    isError:false,
    postFetched:false,
    isLoading:false,
    loggedIn:false,
    message:"",
    comments:[],
    postId:""

}

const postSlice=createSlice({
    name:"posts",
    initialState,
    reducers:{
        reset:()=>initialState,
        resetPostId:(state)=>{
            state.postId=""
        },

    },
    extraReducers:(builder)=>{
        builder
        .addCase(getAllPosts.pending,(state)=>{
          state.isLoading=true;
          state.message="Fetching All posts"
        })
        .addCase(getAllPosts.fulfilled,(state,action)=>{
            state.isLoading=false;
            state.isError=false;
            state.postFetched=true;
            state.posts=action.payload.reverse();
            
        })
        .addCase(getAllPosts.rejected,(state,action)=>{
            state.isError=true;
            state.isLoading=false;
            state.message=action.payload;
        })
        .addCase(getAllComments.fulfilled,(state,action)=>{
            state.comments=action.payload.comments;
           
            state.postId=action.payload.post_id;
        }
        )
    }
})

export const {reset,resetPostId}=postSlice.actions;

export default postSlice.reducer;