// import { useSelector } from 'react-redux'
import DashboardLayout from '@/layout/DashboardLayout'
import UserLayout from '@/layout/UserLayout'
import React, { useEffect } from 'react'
import styles from './styles.module.css'
import { useDispatch, useSelector } from 'react-redux'
import { acceptConnection, getMyConnectionRequests } from '@/config/reudx/action/authAction'
import { BASE_URL } from '@/config'
import { useRouter } from 'next/router'

export default function MyConnectionPage() {

  const dispatch=useDispatch();
  const authState=useSelector((state)=>state.auth);
  const router=useRouter();

  useEffect(()=>{
   dispatch(getMyConnectionRequests({token:localStorage.getItem("token")}));
  },[])

  useEffect(()=>{
 
    if(authState.connectionRequest.length!==0){
      console.log(authState.connectionRequest);
    }

  },[authState.connectionRequest])
 
  return (
   <UserLayout>
       <DashboardLayout>
        <div className={styles.container}>
          <h4>My Connections</h4>
          {authState.connectionRequest.length===0 && <h1>No connection Request Pending...</h1>}
          {authState.connectionRequest.length!==0 && authState.connectionRequest.filter((connection)=>connection.status_accepted===null).map((connection,index)=>{
            return (
              <div onClick={()=>{
                 router.push(`/view_profile/${connection.userId.username}`)
              }} key={index} className={styles.connection}>
                <div style={{display:"flex",alignItems:"center",gap:"1.2rem",justifyContent:"space-between"}}>
                <div className={styles.profilePic}>
                  <img src={`${BASE_URL}/${connection.userId.profilePicture}`} alt="" />
                </div>
                <div className={styles.details}>
                  <h4>{connection.userId.name}</h4>
                  <p>{connection.userId.username}</p>
                </div>
                <button onClick={(e)=>{
                e.stopPropagation();
                dispatch(acceptConnection({token:localStorage.getItem("token"),user_id:connection._id,action:"accept"}))
                }} className={styles.connectedButton}>Accept</button>
                </div>
              </div>
            )
          })}

          <h4>My networks</h4>
          {authState.connectionRequest.length!==0 && authState.connectionRequest.filter((connection)=>connection.status_accepted!==null).map((connection,index)=>{
            return (
              <div onClick={()=>{
                 router.push(`/view_profile/${connection.userId.username}`)
              }} key={index} className={styles.connection}>
                <div style={{display:"flex",alignItems:"center",gap:"1.2rem",justifyContent:"space-between"}}>
                <div className={styles.profilePic}>
                  <img src={`${BASE_URL}/${connection.userId.profilePicture}`} alt="" />
                </div>
                <div className={styles.details}>
                  <h4>{connection.userId.name}</h4>
                  <p>{connection.userId.username}</p>
                </div>
                
                </div>
              </div>
            )
          })}
        </div>
       </DashboardLayout>
      </UserLayout>
  )
}
