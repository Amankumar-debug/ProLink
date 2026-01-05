const { createSlice } = require("@reduxjs/toolkit")
import { act } from "react";
import { getAboutUser, getAllUsers, getConnectionRequest, getMyConnectionRequests, loginUser, registerUser } from "../../action/authAction";


// const { getInstance } = require("next/dist/compiled/amphtml-validator")


const initialState={
    user:undefined,
    isError:false,
    isSuccess:false,
    isLoading:false,
    loggedIn:false,
    message:"",
    isTokenThere:false,
    profilefeched:false,
    connections:[],
    connectionRequest:[],
    all_users:[],
    allProfileFeched:false
}

const authSlice=createSlice({
            name:"auth",
            initialState,
            reducers:{
                reset:()=>initialState,
                handleLoginUser:(state)=>{
                    state.message="Hello"
                },
                emptyMessage:(state)=>{
                    state.message=""
                },
                setIsTokenThere:(state)=>{
                    state.isTokenThere=true
                },
                setIsTokenNotThere:(state)=>{
                    state.isTokenThere=false
                }

            },
            extraReducers:(builder)=>{
                builder
                .addCase(loginUser.pending,(state)=>{
                    state.isLoading=true;
                    state.message="Knocking the door"
                })
                .addCase(loginUser.fulfilled,(state,action)=>{
                    state.isLoading=false;
                    state.isError=false;
                    state.isSuccess=true;
                    state.loggedIn=true;
                    state.message="login successful";
                })
                .addCase(loginUser.rejected,(state,action)=>{
                    state.isLoading=false;
                    state.isError=true;
                    
                    state.message=action.payload;
                    
                })
                .addCase(registerUser.pending,((state)=>{
                     state.isLoading=true;
                    state.message="Registering...";
                }))
                .addCase(registerUser.fulfilled,(state,action)=>{
                     state.isLoading=false;
                    state.isError=false;
                    state.isSuccess=true;
                    state.loggedIn=true;
                    state.message={
                        message:"Register Successfully! Please Sign In"
                    }
                })
                .addCase(registerUser.rejected,(state,action)=>{
                    state.isLoading=false;
                    state.isError=true;
                    // state.loggedIn=false;
                    state.message=action.payload;
                })
                .addCase(getAboutUser.fulfilled,(state,action)=>{
                    state.isLoading=false;
                    state.isError=false;
                    state.profilefeched=true;
                    state.user=action.payload.profile;
                })
                .addCase(getAllUsers.fulfilled,(state,action)=>{
                    state.isLoading=false;
                    state.isError=false;
                    state.allProfileFeched=true;
                    state.all_users=action.payload.profiles;
                })
                .addCase(getConnectionRequest.fulfilled,(state,action)=>{
                    state.connections=action.payload;
                })
                .addCase(getConnectionRequest.rejected,(state,action)=>{
                    state.message=action.payload;
                })
                .addCase(getMyConnectionRequests.fulfilled,(state,action)=>{
                    state.connectionRequest=action.payload;
                })
                .addCase(getMyConnectionRequests.rejected,(state,action)=>{
                    state.message=action.payload;
                })

            }

})


export const {emptyMessage,reset,setIsTokenNotThere,setIsTokenThere}=authSlice.actions;

export default authSlice.reducer;