import { client } from "@/config";
import { createAsyncThunk } from "@reduxjs/toolkit";




export const loginUser=createAsyncThunk(
    'user/login',
    async(user,thunkAPI)=>{
        try {
            const response=await client.post("/login",{
                email:user.email,
                password:user.password
            })

            if(response.data.token){
                localStorage.setItem("token",response.data.token);
            }else{
                return thunkAPI.rejectWithValue({message:"token not provided"});
            }

            return thunkAPI.fulfillWithValue(response.data.token);
        } catch (error) {
            return thunkAPI.rejectWithValue(error.response.data);
        }
    }
)


export const registerUser=createAsyncThunk(
    'user/register',
    async (user,thunkAPI) => {
        try {

            const response=await client.post("/signup",{
                name:user.name,
                username:user.username,
                email:user.email,
                password:user.password
            })

            return thunkAPI.fulfillWithValue(response.data);
            
        } catch (error) {
             return thunkAPI.rejectWithValue(error.response.data);
        }
    }
)


export const getAboutUser=createAsyncThunk(
    "user/getAboutUser",
    async(user,thunkAPI)=>{
      try {
  
        const response=await client.get("/get_user_and_profile",{
           params:{
            token:user.token
           }
        })

        return thunkAPI.fulfillWithValue(response.data);
        
        
      } catch (error) {
        return thunkAPI.rejectWithValue(error.response.data);
      }
    }
)


export const getAllUsers=createAsyncThunk(
    "user/getAllUsers",
    async(_,thunkAPI)=>{

        try {
            const response=await client.get("/get_all_user_profiles");

            return thunkAPI.fulfillWithValue(response.data);
        } catch (error) {
            return thunkAPI.rejectWithValue(error.response.data);
        }
    }
)

export const sendConnectionRequest=createAsyncThunk(
    "user/sendConnectionRequest",
    async(user,thunkAPI)=>{
        try {

            const response=await client.post("/user/send_connection_request",{
                token:user.token,
                connectionId:user.user_id
            }

            )

            thunkAPI.dispatch(getConnectionRequest({token:user.token}))

            return thunkAPI.fulfillWithValue(response.data);
            
        } catch (error) {
            return thunkAPI.rejectWithValue(error.response.data);
        }
    }
)


export const getConnectionRequest=createAsyncThunk(
    "user/getConnectionRequest",
    async(user,thunkAPI)=>{
        try {

            const response=await client.get("/user/get_connection_request",{
                params:{
                    token:user.token
                }
            })

            return thunkAPI.fulfillWithValue(response.data.connections)
            
        } catch (error) {
            return thunkAPI.rejectWithValue(error.response.data);
        }
    }
)

export const getMyConnectionRequests=createAsyncThunk(
    "user/getMyConnectionRequest",
    async(user,thunkAPI)=>{
        try {
            
            const response=await client.get("/user/user_connection_request",{
                params:{
                    token:user.token
                }
            })

            return thunkAPI.fulfillWithValue(response.data.connections);
        } catch (error) {
            return thunkAPI.rejectWithValue(error.response.data);
        }
    }
)


export const acceptConnection=createAsyncThunk(
    "user/acceptConnection",
    async(user,thunkAPI)=>{
        try {

            const response=await client.post("/user/accept_connection_request",{
                token:user.token,
                requestId:user.user_id,
                action_type:user.action
            })
                        thunkAPI.dispatch(getConnectionRequest({token:user.token}));
            thunkAPI.dispatch(getMyConnectionRequests({token:user.token}));
            return thunkAPI.fulfillWithValue(response.data);
        } catch (error) {
            return thunkAPI.rejectWithValue(error.response.data);
        }
    }
)