import { Router } from "express"
import {userSignUp,userLogin,uploadProgilePicture,updateUserProfile, getUserAndProfile, updateUserData, getAllUserProfile, downloadProfile, sendConnectionRequest, getMyConnectionRequests, WhatAreMyConnections, acceptConnectionRequest, getUserAndProfileBaesdOnUsername} from "../controllers/user.controller.js";
import multer from "multer";
// import {storage} from "../cloudConfig.js";
// const upload=multer({storage});

const storage=multer.diskStorage({
    destination:function(req,file,cb){
        cb(null,"./uploads/")
    },
    filename:function(req,file,cb){
        cb(null,Date.now()+"-"+file.originalname)
    }
});

const upload=multer({storage:storage});


const router=Router();


router.route("/update_profile_picture").post(upload.single("profile_picture"),uploadProgilePicture)
router.post("/signup",userSignUp);
router.post("/login",userLogin);
router.route("/update_user_profile").post(updateUserProfile);
router.route("/get_user_and_profile").get(getUserAndProfile);
router.route("/update_user_data").post(updateUserData);
router.route("/get_all_user_profiles").get(getAllUserProfile)
router.route("/user/download_profile").get(downloadProfile);
router.route("/user/send_connection_request").post(sendConnectionRequest);
router.route("/user/get_connection_request").get(getMyConnectionRequests);
router.route("/user/user_connection_request").get(WhatAreMyConnections);
router.route("/user/accept_connection_request").post(acceptConnectionRequest);
router.route("/user/get_user_and_profile_based_on_username").get(getUserAndProfileBaesdOnUsername);


export default router;