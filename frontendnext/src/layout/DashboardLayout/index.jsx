import React, { useEffect } from "react";
import styles from "./styles.module.css";
import { useRouter } from "next/router";
import { setIsTokenThere } from "@/config/reudx/reducer/authReducer";
import { useDispatch, useSelector } from "react-redux";

export default function DashboardLayout({ children }) {

  const router=useRouter();
  const dispatch=useDispatch();
  const authState=useSelector((state)=>state.auth);

   useEffect(()=>{
          if(localStorage.getItem("token")===null){
              router.push("/login");
          }
  
          dispatch(setIsTokenThere());
      },[])

  return (
    <>
      <div className="container">
        <div className={styles.home_container}>
          <div className={styles.home_container_leftBar}>
            <div className={styles.sideBarOptions} onClick={()=>{
              router.push("/dashboard")
            }}>
              <svg
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                stroke-width="1.5"
                stroke="currentColor"
                class="size-6"
              >
                <path
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  d="m2.25 12 8.954-8.955c.44-.439 1.152-.439 1.591 0L21.75 12M4.5 9.75v10.125c0 .621.504 1.125 1.125 1.125H9.75v-4.875c0-.621.504-1.125 1.125-1.125h2.25c.621 0 1.125.504 1.125 1.125V21h4.125c.621 0 1.125-.504 1.125-1.125V9.75M8.25 21h8.25"
                />
              </svg>

              <p>Scroll</p>
            </div>
            <div className={styles.sideBarOptions} onClick={()=>{
              router.push("/discover")
            }}>
              <svg
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                strokeWidth={1.5}
                stroke="currentColor"
                className="size-6"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="m21 21-5.197-5.197m0 0A7.5 7.5 0 1 0 5.196 5.196a7.5 7.5 0 0 0 10.607 10.607Z"
                />
              </svg>

              <p>Discover</p>
            </div>
            <div className={styles.sideBarOptions} onClick={()=>{
              router.push("/myConnections")
            }}>
              <svg
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                stroke-width="1.5"
                stroke="currentColor"
                class="size-6"
              >
                <path
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  d="M15.75 6a3.75 3.75 0 1 1-7.5 0 3.75 3.75 0 0 1 7.5 0ZM4.501 20.118a7.5 7.5 0 0 1 14.998 0A17.933 17.933 0 0 1 12 21.75c-2.676 0-5.216-.584-7.499-1.632Z"
                />
              </svg>

              <p>My Connections</p>
            </div>

            <div className={styles.sideBarOptions} onClick={()=>{
              router.push("/ResumeAnalyzer")
            }}>
              <svg xmlns="http://www.w3.org/2000/svg" x="0px" y="0px"  viewBox="0 0 48 48">
<path fill="#2196f3" d="M23.426,31.911l-1.719,3.936c-0.661,1.513-2.754,1.513-3.415,0l-1.719-3.936	c-1.529-3.503-4.282-6.291-7.716-7.815l-4.73-2.1c-1.504-0.668-1.504-2.855,0-3.523l4.583-2.034	c3.522-1.563,6.324-4.455,7.827-8.077l1.741-4.195c0.646-1.557,2.797-1.557,3.443,0l1.741,4.195	c1.503,3.622,4.305,6.514,7.827,8.077l4.583,2.034c1.504,0.668,1.504,2.855,0,3.523l-4.73,2.1	C27.708,25.62,24.955,28.409,23.426,31.911z"></path><path fill="#7e57c2" d="M38.423,43.248l-0.493,1.131c-0.361,0.828-1.507,0.828-1.868,0l-0.493-1.131	c-0.879-2.016-2.464-3.621-4.44-4.5l-1.52-0.675c-0.822-0.365-0.822-1.56,0-1.925l1.435-0.638c2.027-0.901,3.64-2.565,4.504-4.65	l0.507-1.222c0.353-0.852,1.531-0.852,1.884,0l0.507,1.222c0.864,2.085,2.477,3.749,4.504,4.65l1.435,0.638	c0.822,0.365,0.822,1.56,0,1.925l-1.52,0.675C40.887,39.627,39.303,41.232,38.423,43.248z"></path>
</svg>

              <p>AI ResumeLens</p>
            </div>

            <div className={styles.sideBarOptions} onClick={()=>{
              router.push("/ChatAssistence")
            }}>
             <svg xmlns="http://www.w3.org/2000/svg" x="0px" y="0px" viewBox="0 0 50 50">
<path d="M49.04,24.001l-1.082-0.043h-0.001C36.134,23.492,26.508,13.866,26.042,2.043L25.999,0.96C25.978,0.424,25.537,0,25,0	s-0.978,0.424-0.999,0.96l-0.043,1.083C23.492,13.866,13.866,23.492,2.042,23.958L0.96,24.001C0.424,24.022,0,24.463,0,25	c0,0.537,0.424,0.978,0.961,0.999l1.082,0.042c11.823,0.467,21.449,10.093,21.915,21.916l0.043,1.083C24.022,49.576,24.463,50,25,50	s0.978-0.424,0.999-0.96l0.043-1.083c0.466-11.823,10.092-21.449,21.915-21.916l1.082-0.042C49.576,25.978,50,25.537,50,25	C50,24.463,49.576,24.022,49.04,24.001z"></path>
</svg>
              <p>Chat Assistant</p>
            </div>

          </div>

          <div className={styles.home_container_feedBar}> {children}</div>

          <div className={styles.home_container_extraContainer}>
           <h3>Top Profiles</h3>

           {authState.allProfileFeched && authState.all_users.map((profile)=>{

            return (
              <div key={profile.id}>
                <p>{profile.userId.name}</p>
                </div>
            )
           })}

          </div>
        </div>
      </div>
    </>
  );
}
