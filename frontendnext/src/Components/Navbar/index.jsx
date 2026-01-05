import React from 'react'
import styles from './styles.module.css'
import { useRouter } from 'next/router'
import { useDispatch, useSelector } from 'react-redux';
import { reset } from '@/config/reudx/reducer/authReducer';

export default function Navbar() {

  const router=useRouter();
  const authState=useSelector((state)=>state.auth);
  const dispatch=useDispatch();
  return (
   <>
   <div className={styles.container}>
    <nav className={styles.navbar}>

       <h1 style={{cursor:"pointer" , fontWeight:"600"}} onClick={()=>{
        router.push("/")
       }}>LinkUp</h1>


       <div className={styles.navbarOptionContainer}>



       {authState.profilefeched &&<div>
        <div style={{display:"flex", gap:"1.2rem"}}>
          <p>Hey, {authState.user.userId.username}</p>
          
          <p style={{cursor:"pointer",fontWeight:"bold"}}>Profile</p>
          <p onClick={()=>{
            localStorage.removeItem("token")
            dispatch(reset())
            router.push('/login')
          }} style={{cursor:"pointer",fontWeight:"bold"}}>Log Out</p>
          </div>
        
        </div>}
 

        {!authState.profilefeched && <div className={styles.navbarOptionContainer}>
        <div onClick={()=>{
          router.push('/login')
        }}  className={styles.buttonJoin}>
          <p>Be a Part</p>
        </div>
        </div>}



       </div>
    </nav>
   


   </div>
   </>
  )
}
