import { Router } from "express";
import { verifyJwt } from "../middlewares/auth.middlewares.js";
import { createSpace, deleteSpace, getAllSpaces, getSpaceById, updateAvatar, updateSpace } from "../controllers/spaces.controllers.js";
import { upload } from "../middlewares/multer.middleware.js";

const router = Router();

router.route("/create-space").post(
    upload.fields(
        [
          {
           name: "avatar",
           maxCount: 1
          }
          
        ]
    ),verifyJwt , createSpace)

router.route("/delete-space").post(verifyJwt , deleteSpace)

router.route("/update-space").patch(verifyJwt , updateSpace)
router.route("/getSpace/:SpaceId").get(verifyJwt ,getSpaceById )
router.route("/update-avatar").patch(verifyJwt , upload.single("avatar") , updateAvatar)
router.route("/getSpaces").get(verifyJwt , getAllSpaces)


export default router