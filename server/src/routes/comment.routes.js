import { Router } from "express";
import { verifyJwt } from "../middlewares/auth.middlewares.js";
import { deleteComment, getAllComment, updatecomment, uploadComment } from "../controllers/comment.controllers.js";


const router = Router()

router.route("/uploadComment/:TestimonialId").post(verifyJwt , uploadComment)
router.route("deleteComment/:commentId").post(verifyJwt , deleteComment)
router.route("updatdComment/:CommentId").patch(verifyJwt , updatecomment)
router.route("getComments/:TestimonialId").get(verifyJwt , getAllComment)

export default router