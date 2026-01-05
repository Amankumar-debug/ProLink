import UserLayout from "@/layout/UserLayout";
import { useRouter } from "next/router";
import React, { useEffect, useReducer, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import styles from "./style.module.css";
import { Stoke } from "next/font/google";
import { loginUser, registerUser } from "@/config/reudx/action/authAction";
import { emptyMessage } from "@/config/reudx/reducer/authReducer";

export default function login() {
  const authState = useSelector((state) => state.auth);

  const router = useRouter();
  const dispatch=useDispatch();

  const [userLoginMethod,setUserLoginMethod]=useState(false);

  const [name,setName]=useState("");
  const [username,setUsername]=useState("");
  const [email,setEmail]=useState("");
  const [password,setPassword]=useState("");


  
 
  useEffect(()=>{
    dispatch(emptyMessage());
  },[userLoginMethod])

 

  const handleRegister =async()=>{
    console.log("register");
    dispatch(registerUser({name,username,email,password}))
     
  } 

  const handleLogin=async()=>{
    console.log("login");
    dispatch(loginUser({email,password}));
          
  }



    // useEffect(() => {
    //     if (authState.loggedIn) {
    //       router.push("/dashboard");
    //     }
    //   },[authState.loggedIn]);


   useEffect(()=>{
    if(localStorage.getItem("token")){
      router.push("/dashboard");
    }
  })

  return <UserLayout>

    <div className={styles.container}>
       <div  className={styles.card_container}>
        <div className={styles.card_container_left}>
        
        <p className={styles.cardleft_heading}>{userLoginMethod?"Sign In":"Sign Up"}</p>
        <p style={{color:authState.isError?"red":"green"}}>{authState.message.message}</p>

        <div className={styles.input_containers}>
          {!userLoginMethod && <div  className={styles.input_row}>
            <input onChange={(e)=>setUsername(e.target.value)} className={styles.input_feild} type="text" placeholder="Username"></input>
           <input onChange={(e)=>setName(e.target.value)} className={styles.input_feild} type="text" placeholder="Name"></input>

          </div>}
           <input onChange={(e)=>setEmail(e.target.value)} className={styles.input_feild} type="email" placeholder="Email"></input>
           <input onChange={(e)=>setPassword(e.target.value)} className={styles.input_feild} type="password" placeholder="Password"></input>
         
         <button  onClick={()=>{

          if(userLoginMethod){
            handleLogin();

          }else{
            handleRegister();
          }
         }} className={styles.button_with_outline}>
          {userLoginMethod?"Sign In":"sign Up"}
         </button>
        </div>
        </div>

        <div className={styles.card_container_right}>
          
            {userLoginMethod?<p>Don't have an Account?</p>:<p>Already have a Account?</p>}
            <div onClick={()=>{
              setUserLoginMethod(!userLoginMethod)
            }} className={styles.button_with_outline}  style={{textAlign:"center"}}>
              <p>{userLoginMethod?"Sign Up":"Sign In"}</p>

           
          </div>
        </div>
       </div>
    </div>
  </UserLayout>;
}
