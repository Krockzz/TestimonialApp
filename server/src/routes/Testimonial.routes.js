import { Router } from "express";
// import { verify } from "jsonwebtoken";
import { verifyJwt } from "../middlewares/auth.middlewares.js";
import { createTestimonial, deleteTestimonial, getAllTestimonial, getTestimonialById, likecontroller, updateTestimonial , importTweetAsTestimonial, verifyEmail, toggleFeaturedTestimonial, importRedditAsTestimonial , importYouTubeVideoAsTestimonial } from "../controllers/Testimonial.controllers.js";
import { upload } from "../middlewares/multer.middleware.js";

const router = Router()

// router.route("/get-Testimonial/:spaceId").get(verifyJwt , getAllTestimonial)
router.route("/create-Testimonial/:spaceId").post( verifyJwt ,upload.fields(
    [
        {
            name: "videoURL",
            maxCount:1
        },
        {
            name: "avatar",
            maxCount : 1
        },

        
    ]

    

    
) , createTestimonial)
router.route("/import-twitter/:spaceId").post(verifyJwt , importTweetAsTestimonial)
router.route("/import-reddit/:spaceId").post(verifyJwt , importRedditAsTestimonial)
router.route("/delete/:TestimonialId").post( verifyJwt , deleteTestimonial)
router.route("/update-Testimonial/:TestimonialId").patch(verifyJwt , updateTestimonial)
router.route("/getTestimonials/:spaceId").get(verifyJwt , getAllTestimonial)
router.route("/testimonial/:TestimonialId/like").post(verifyJwt , likecontroller);
router.route("/getTestimonial/:TestiId").get(  getTestimonialById)
router.route("/verify-email").get(verifyEmail)
router.route("/toggle-featured/:testimonialId").patch(toggleFeaturedTestimonial)
router.route("/import-youtube/:spaceId").post(verifyJwt , importYouTubeVideoAsTestimonial)

export default router;