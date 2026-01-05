import { getAllUsers } from '@/config/reudx/action/authAction';
import DashboardLayout from '@/layout/DashboardLayout'
import UserLayout from '@/layout/UserLayout'
import React, { useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import style from "./styles.module.css"
import { BASE_URL } from '@/config';
import { useRouter } from 'next/router';

export default function DiscoverPage() {


  const router=useRouter();

  const dispatch=useDispatch();
  const authState=useSelector((state)=>state.auth);

  useEffect(()=>{
    if(!authState.allProfileFeched){
        dispatch(getAllUsers());
    }
  },[])

  return (
    <UserLayout>
        <DashboardLayout>
         <div className={style.container}>
          <h1>Discover</h1>
          <div className={style.allUserProfile}>
            {authState.allProfileFeched && authState.all_users.map((user)=>{
              return (
                <div onClick={()=>{
                   router.push(`/view_profile/${user.userId.username}`)
                }} key={user._id} className={style.userCard}>
                    <img className={style.userCard_img} src={`${BASE_URL}/${user.userId.profilePicture}`} alt="profile" />
                   <div>
                    <h2>{user.userId.name}</h2>
                    <p>{user.userId.username}</p>
                    </div> 
                  </div>
              )
            })}
          </div>
         </div>
        </DashboardLayout>
       </UserLayout>
  )
}
