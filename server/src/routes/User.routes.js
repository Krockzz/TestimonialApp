import { Router } from "express";
import { RegisterUser , changePassword, forgotPassword, getUserInfo, loginUser, logoutUser ,updateUser } from "../controllers/user.controller.js";
import { verifyJwt } from "../middlewares/auth.middlewares.js";
const router = Router();

router.route("/register").post(RegisterUser)
router.route("/login").post(loginUser)
// router.route("/me").get(verifyJwt , getUserInfo)
router.route("/logout").post(verifyJwt , logoutUser)
router.post("/change-password", verifyJwt, changePassword);
router.route("/updateUser").patch(verifyJwt , updateUser)
router.route("/forgot-password").post(forgotPassword)
router.route("/verify").get(verifyJwt , (req, res) => {
    return res.json({user: req.user})
});



export default router