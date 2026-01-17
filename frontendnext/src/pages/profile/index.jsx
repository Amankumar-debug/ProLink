import React, { useEffect, useReducer, useState } from 'react'
import styles from "./styles.module.css"
import UserLayout from '@/layout/UserLayout'
import DashboardLayout from '@/layout/DashboardLayout'
import { BASE_URL } from '@/config'
import { useRouter } from 'next/router'
import { useDispatch, useSelector } from 'react-redux'
import { getAboutUser } from '@/config/reudx/action/authAction'
import { getAllPosts } from '@/config/reudx/action/postAction'

export default function ProfilePage() {

    const router=useRouter();

    const dispatch=useDispatch();

    const authState=useSelector((state)=>state.auth);

    const postState=useSelector((state)=>state.posts);

    const [userProfile,setUserProfile]=useState({});
    const [userPosts,setUserPosts]=useState([]);

    // useEffect(()=>{
    //     dispatch(getAboutUser({token:localStorage.getItem("token")}));
    //     dispatch(getAllPosts());
    // },[])

    // useEffect(()=>{
    //      if(authState.user !=undefined){
    //         setUserProfile(authState.user);
            
    //         let post=postState.posts.filter((post)=>{
    //             return post.userId.username===authState.user.userId.username
    //         })
    //         console.log(post,authState.user.userId.username)
    //         setUserPosts(post);
    //      }
    // },[authState.user,postState.posts])
  return (
    <div> <UserLayout>
            <DashboardLayout>
              <h1>Working on it, sorry for the inconvinience</h1>
              {/* <div className={styles.container}>
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
              </div> */}
            </DashboardLayout>
        </UserLayout>

    </div>
  )
}
