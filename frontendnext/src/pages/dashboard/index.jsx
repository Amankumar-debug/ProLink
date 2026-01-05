import { getAboutUser, getAllUsers } from "@/config/reudx/action/authAction";
import {
  getAllPosts,
  createPost,
  deletePost,
  increaseLikes,
  getAllComments,
  postComment,
  deleteComment,
} from "@/config/reudx/action/postAction";
import DashboardLayout from "@/layout/DashboardLayout";
import UserLayout from "@/layout/UserLayout";
import { useRouter } from "next/router";
import React, { Children, useEffect, useReducer, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import styles from "./styles.module.css";
import { BASE_URL } from "@/config";
import { resetPostId } from "@/config/reudx/reducer/postReducer";

export default function Dashborad() {
  const router = useRouter();
  const dispatch = useDispatch();
  const authState = useSelector((state) => state.auth);
  const postState = useSelector((state) => state.posts);

  const [postContent, setPostContent] = useState("");
  const [fileContent, setFileContent] = useState();
  const [commentText,setCommentText]=useState("");

  const handleUpload = async () => {
    dispatch(createPost({ file: fileContent, body: postContent }));
    setPostContent("");
    setFileContent(null);
    dispatch(getAllPosts());
  };

  useEffect(() => {
    if (authState.isTokenThere) {
      dispatch(getAllPosts());
      dispatch(getAboutUser({ token: localStorage.getItem("token") }));
    }

    if (!authState.allProfileFeched) {
      dispatch(getAllUsers());
    }
  }, [authState.isTokenThere]);

  if (authState.user) {
    return (
      <UserLayout>
        <DashboardLayout>
          <div className={styles.scrollComponent}>
            <div className={styles.wrapper}>
              <div className={styles.createPostContainer}>
                <img
                  className={styles.userProfile}
                  src={`${BASE_URL}/${authState.user.userId.profilePicture}`}
                  alt="profile"
                ></img>
                <textarea
                  onChange={(e) => {
                    setPostContent(e.target.value);
                  }}
                  placeholder={"Whats in your mind?"}
                  className={styles.textAreaOfContent}
                  name=""
                  id=""
                  value={postContent}
                ></textarea>
                <label htmlFor="fileupload">
                  <div className={styles.fab}>
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
                        d="M12 4.5v15m7.5-7.5h-15"
                      />
                    </svg>
                  </div>
                </label>
                <input
                  onChange={(e) => {
                    setFileContent(e.target.files[0]);
                  }}
                  type="file"
                  hidden
                  id="fileupload"
                />
                {postContent.length > 0 && (
                  <div className={styles.uploadButton} onClick={handleUpload}>
                    Post
                  </div>
                )}
              </div>

              <div className={styles.postContainer}>
                {postState.postFetched &&
                  postState.posts.map((post) => {
                    return (
                      <div key={post._id} className={styles.singleCard}>
                        <div className={styles.singleCardProfileContainer}>
                          <img
                            src={`${BASE_URL}/${post.userId.profilePicture}`}
                          ></img>
                          <div>
                            <div
                              style={{
                                display: "flex",
                                justifyContent: "space-between",
                              }}
                            >
                              <p style={{ fontWeight: "bold" }}>
                                {post.userId.name}
                              </p>
                              {post.userId._id ===
                                authState.user.userId._id && (
                                <div
                                  onClick={async () => {
                                    await dispatch(
                                      deletePost({ post_id: post._id })
                                    );
                                    await dispatch(getAllPosts());
                                  }}
                                  style={{ cursor: "pointer" }}
                                >
                                  <svg
                                    style={{ height: "1.4em", color: "red" }}
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
                                      d="m14.74 9-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 0 1-2.244 2.077H8.084a2.25 2.25 0 0 1-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 0 0-3.478-.397m-12 .562c.34-.059.68-.114 1.022-.165m0 0a48.11 48.11 0 0 1 3.478-.397m7.5 0v-.916c0-1.18-.91-2.164-2.09-2.201a51.964 51.964 0 0 0-3.32 0c-1.18.037-2.09 1.022-2.09 2.201v.916m7.5 0a48.667 48.667 0 0 0-7.5 0"
                                    />
                                  </svg>
                                </div>
                              )}
                            </div>
                            <p style={{ color: "gray" }}>
                              @{post.userId.username}
                            </p>
                            <p style={{ paddingTop: "1.3rem" }}>{post.body}</p>

                            <div className={styles.singleCard_img}>
                              <img src={`${BASE_URL}/${post.media}`}></img>
                            </div>

                            <div className={styles.optionContainer}>
                              <div
                                onClick={async () => {
                                  await dispatch(
                                    increaseLikes({ post_id: post._id })
                                  );
                                  await dispatch(getAllPosts());
                                }}
                                className={styles.singleOption}
                              >
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
                                    d="M6.633 10.25c.806 0 1.533-.446 2.031-1.08a9.041 9.041 0 0 1 2.861-2.4c.723-.384 1.35-.956 1.653-1.715a4.498 4.498 0 0 0 .322-1.672V2.75a.75.75 0 0 1 .75-.75 2.25 2.25 0 0 1 2.25 2.25c0 1.152-.26 2.243-.723 3.218-.266.558.107 1.282.725 1.282m0 0h3.126c1.026 0 1.945.694 2.054 1.715.045.422.068.85.068 1.285a11.95 11.95 0 0 1-2.649 7.521c-.388.482-.987.729-1.605.729H13.48c-.483 0-.964-.078-1.423-.23l-3.114-1.04a4.501 4.501 0 0 0-1.423-.23H5.904m10.598-9.75H14.25M5.904 18.5c.083.205.173.405.27.602.197.4-.078.898-.523.898h-.908c-.889 0-1.713-.518-1.972-1.368a12 12 0 0 1-.521-3.507c0-1.553.295-3.036.831-4.398C3.387 9.953 4.167 9.5 5 9.5h1.053c.472 0 .745.556.5.96a8.958 8.958 0 0 0-1.302 4.665c0 1.194.232 2.333.654 3.375Z"
                                  />
                                </svg>

                                <p>{post.likes}</p>
                              </div>

                              <div
                                onClick={() => {
                                  dispatch(
                                    getAllComments({ post_id: post._id })
                                  );
                                }}
                                className={styles.singleOption}
                              >
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
                                    d="M20.25 8.511c.884.284 1.5 1.128 1.5 2.097v4.286c0 1.136-.847 2.1-1.98 2.193-.34.027-.68.052-1.02.072v3.091l-3-3c-1.354 0-2.694-.055-4.02-.163a2.115 2.115 0 0 1-.825-.242m9.345-8.334a2.126 2.126 0 0 0-.476-.095 48.64 48.64 0 0 0-8.048 0c-1.131.094-1.976 1.057-1.976 2.192v4.286c0 .837.46 1.58 1.155 1.951m9.345-8.334V6.637c0-1.621-1.152-3.026-2.76-3.235A48.455 48.455 0 0 0 11.25 3c-2.115 0-4.198.137-6.24.402-1.608.209-2.76 1.614-2.76 3.235v6.226c0 1.621 1.152 3.026 2.76 3.235.577.075 1.157.14 1.74.194V21l4.155-4.155"
                                  />
                                </svg>
                              </div>

                              <div
                                onClick={() => {
                                  router.push(
                                    "https://www.linkedin.com/in/aman-kumar-687076276/"
                                  );
                                }}
                                className={styles.singleOption}
                              >
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
                                    d="M7.217 10.907a2.25 2.25 0 1 0 0 2.186m0-2.186c.18.324.283.696.283 1.093s-.103.77-.283 1.093m0-2.186 9.566-5.314m-9.566 7.5 9.566 5.314m0 0a2.25 2.25 0 1 0 3.935 2.186 2.25 2.25 0 0 0-3.935-2.186Zm0-12.814a2.25 2.25 0 1 0 3.933-2.185 2.25 2.25 0 0 0-3.933 2.185Z"
                                  />
                                </svg>
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                    );
                  })}
              </div>
            </div>
          </div>
          {postState.postId!==""&&
          
           <div onClick={()=>{
            dispatch(resetPostId());
           }}
           className={styles.commentsContainer}>

            <div onClick={(e)=>{
              e.stopPropagation()
            }} className={styles.allCommentsContainer}>
   
           {postState.comments.length === 0 && <h2>No Comments</h2>}

           {postState.comments.length !== 0 &&
             <div>
              {postState.comments.map((comment)=>{
                return(
                  <div key={comment._id} className={styles.singleComment}>
                    <div className={styles.singleCommentProfileContainer}>
                      <img src={`${BASE_URL}/${comment.userId.profilePicture}`}></img>
                      <div>
                        <p style={{fontWeight:"bold",fontSize:"1.2rem"}}>{comment.userId.name}</p>
                        <p style={{color:"gray"}}>@{comment.userId.username}</p>
                          <p >{comment.body}</p>
                      </div>
                    </div>
                     {comment.userId._id ===
                                authState.user.userId._id && (
                                <div
                                  onClick={async () => {
                                    await dispatch(
                                      deleteComment({ comment_id: comment._id })
                                    );
                                    await dispatch(getAllComments({post_id:postState.postId}));
                                  }}
                                  style={{ cursor: "pointer" }}
                                >
                                  <svg
                                    style={{ height: "1.4em", color: "red" }}
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
                                      d="m14.74 9-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 0 1-2.244 2.077H8.084a2.25 2.25 0 0 1-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 0 0-3.478-.397m-12 .562c.34-.059.68-.114 1.022-.165m0 0a48.11 48.11 0 0 1 3.478-.397m7.5 0v-.916c0-1.18-.91-2.164-2.09-2.201a51.964 51.964 0 0 0-3.32 0c-1.18.037-2.09 1.022-2.09 2.201v.916m7.5 0a48.667 48.667 0 0 0-7.5 0"
                                    />
                                  </svg>
                                </div>
                              )}
                  
                  </div>
                )
              })}
              </div>}

           <div className={styles.postCommentContainer}>
            <input onChange={(e)=>{setCommentText(e.target.value)}} placeholder="Comment here" type="text"></input>
            <div onClick={()=>{
              dispatch(postComment({post_id:postState.postId,body:commentText}))
              dispatch(getAllComments({ post_id:postState.postId })
              )
            }} className={styles.postCommentContainerButton}>
              <p>Comment</p>
            </div>
           </div>
            </div>
           </div>
          }
        </DashboardLayout>
      </UserLayout>
    );
  } else {
    return (
      <UserLayout>
        <DashboardLayout>
          <div>
            <h1>Loading...</h1>
          </div>
        </DashboardLayout>
      </UserLayout>
    );
  }
}
