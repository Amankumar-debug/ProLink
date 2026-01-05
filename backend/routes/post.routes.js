import {Router} from "express";
import multer from "multer";
import { commentPost, createPost, deleteCommentOfUser, deletePost, getAllPost, getCommentsByPost, incrementLikes } from "../controllers/post.controller.js";
const router=Router();


const storage=multer.diskStorage({
    destination:function(req,file,cb){
        cb(null,"./uploads/");
    },
    filename:function(req,file,cb){
        cb(null,Date.now()+"-"+file.originalname);
    }
})

const upload=multer({storage});

router.route("/post").post(upload.single("media"),createPost);
router.route("/posts").get(getAllPost);
router.route("/delete_post").post(deletePost);
router.route("/comment").post(commentPost);
router.route("/get_comments").get(getCommentsByPost);
router.route("/delete_comment").post(deleteCommentOfUser);
router.route("/increment_post_likes").post(incrementLikes);









export default router;