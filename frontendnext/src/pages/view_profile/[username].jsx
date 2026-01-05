import { BASE_URL, client } from '@/config';
import DashboardLayout from '@/layout/DashboardLayout';
import UserLayout from '@/layout/UserLayout';
import { useSearchParams } from 'next/navigation'
import React, { useEffect, useState } from 'react'
import styles from './styles.module.css'
import { useRouter } from 'next/router';
import { useDispatch, useSelector } from 'react-redux';
import { getAllPosts } from '@/config/reudx/action/postAction';
import { getConnectionRequest, sendConnectionRequest } from '@/config/reudx/action/authAction';

export default function viewProfilePage({userProfile}) {

    const searchParams=useSearchParams();
    const router=useRouter();
    const dispatch=useDispatch();

    const postReducer=useSelector((state)=>state.posts);
    const authState=useSelector((state)=>state.auth);

    const [userPosts,setUserPosts]=useState([]);
    const [isCurrenUserInConnection,setIsCurrentUserInConnection]=useState(false);
    const [isConnectionNull,setIsConnectionNull]=useState(true);

    const getUserPost=async()=>{
      await dispatch(getAllPosts());
      await dispatch(getConnectionRequest({token:localStorage.getItem("token")}))
    }


    useEffect(()=>{

      let post=postReducer.posts.filter((post)=>{
        return post.userId.username===router.query.username
      })

      setUserPosts(post)

    },[postReducer.posts])



    useEffect(()=>{

      if(authState.connections.some(user =>user.connectionId._id === userProfile.userId._id)){

        setIsCurrentUserInConnection(true);
        if(authState.connections.find(user =>user.connectionId._id ===userProfile.userId._id).status_accepted===true){
          setIsConnectionNull(false);
        }
      }
    },[authState.connections])


    useEffect(()=>{
      getUserPost();
    },[])

  return (
    <div>
        <UserLayout>
            <DashboardLayout>
              <div className={styles.container}>
                <div className={styles.backDrop}>
                  <img src={`${BASE_URL}/${userProfile.userId.profilePicture}`} alt='Backdrom'></img>
                </div>
                <div className={styles.profileDetailsContainer} >
                  <div style={{display:"flex",gap:".7"}}>
                    <div style={{flex:".8"}}>
                      <div style={{display:"flex",width:"fit-content",alignItems:"center",gap:"1.2rem"}}>
                        <h1>{userProfile.userId.name}</h1>
                        <p>@{userProfile.userId.username}</p>
                      </div>

                      <div style={{display:"flex",alignItems:"center",gap:"1.2rem"}}>
                      {isCurrenUserInConnection ?
                        <button className={styles.connectedButton}>{isConnectionNull ?"Pending":"Connected"}</button>
                      :
                      <button onClick={()=>{
   
                         dispatch(sendConnectionRequest({token:localStorage.getItem("token"),user_id:userProfile.userId._id}))
                      }} className={styles.connectButton}>Connect</button>
                      }

                      <div style={{cursor:"pointer"}} onClick={async()=>{
                        const response=await client.get(`/user/download_profile?id=${userProfile.userId._id}`)
                        window.open(`${BASE_URL}/${response.data.message}`,"_blank")
                      }}>
                        <svg style={{width:"1.2em",paddingTop:"1rem"}} xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="size-6">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M3 16.5v2.25A2.25 2.25 0 0 0 5.25 21h13.5A2.25 2.25 0 0 0 21 18.75V16.5M16.5 12 12 16.5m0 0L7.5 12m4.5 4.5V3" />
                      </svg>

                      </div>
                    
                      </div>
                   <div style={{marginTop:".8rem"}}><p>{userProfile.bio}</p>
                   </div>
                    </div>
                    <div style={{flex:".2",borderLeft:"1px solid black",paddingLeft:"1rem"}}>
                      <h3>Recent Activity</h3>
                      
                      {userPosts.map((post)=>{
                        return(
                          <div key={post._id} className={styles.postCard}>

                            <div className={styles.card}>
                               
                               <div className={styles.cardProfileContaier}>

                               {post.media !=="" ? <img src={`${BASE_URL}/${post.media}`} alt='img'></img> :
                               <div style={{height:"3.4rem",width:"3.4rem"}}></div>}
                                </div>
                              </div>
                              <p>{post.body}</p>
                            </div>
                        )
                      })}
                    </div>
                  </div>
                </div>

                <div className="workHis">
                  <h4>Work History</h4>

                  <div className={styles.workHistoryContaainer}>

                    {userProfile.pastWork.map((work,index)=>{
                      return (
                        <div key={index} className={styles.workHistoryCard}>
                      
                        <p style={{fontWeight:"bold",display:"flex",alignItems:"center",gap:".8rem"}}>{work.company} - {work.position}</p>
                        <p>years - {work.years}</p>
                          </div>
                      )
                    })}
                  </div>
                </div>

                <div className="education">
                  <h4>Education</h4>
                  <div className={styles.workHistoryContaainer}>

                    {userProfile.education.map((edu,index)=>{
                      return (
                        <div key={index} className={styles.workHistoryCard}>
                      
                        <p style={{fontWeight:"bold",display:"flex",alignItems:"center",gap:".8rem"}}>Field Of Study - {edu.fieldOfStudy}</p>
                        <p style={{fontWeight:"bold"}}>College - {edu.degree}</p>
                        <p style={{fontWeight:"bold"}}>Schoole - {edu.school}</p>
                          </div>
                      )
                    })}
                  </div>
                </div>
              </div>
            </DashboardLayout>
        </UserLayout>

    </div>
  )
}

export async function getServerSideProps(context){
    console.log("view page");
    const request=await client.get("/user/get_user_and_profile_based_on_username",{
       params:{
        username:context.query.username
       }
})

const response =await request.data;

return {props:{userProfile:request.data.profile}}
}
