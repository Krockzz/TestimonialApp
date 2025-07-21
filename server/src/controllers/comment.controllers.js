import { ApiError } from "../utils/ApiError.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import { Comment } from "../models/comment.models.js";
import { Testimonial } from "../models/Testimonials.models.js";

const getAllComment = asyncHandler(async(req, res) => {
    const{TestimonialId} = req.params;
    if(!TestimonialId){
        throw new ApiError(
            400 , 
            "This field is required"
        )
    }

    const { page = 1, limit = 10 } = req.query;
    const options = {
        page: parseInt(page, 10),
        limit: parseInt(limit, 10),
        sort: { createdAt: -1 }, // Sort by newest first
      };

      const aggregatePipeline = await Comment.aggregate(
        [
            {
                $match:{
                    Testimonial:TestimonialId
                }
            }
        ]
      )

      const result = await Comment.aggregatePaginate(aggregatePipeline, options);
      if(!result){
        throw new ApiError(
            400 , 
            "No comments are found!"
        )
      }

      return res.status(200).json({
        success: true,
        message: "Comments fetched successfully",
        data: result,
      });
})

const uploadComment = asyncHandler(async(req , res) => {

    const {comment } = req.body();

    if(!comment || comment.trim() == ""){
        throw new ApiError(
            400 , 
            "Please provide some text!"
        )
    }
    const user = req.user?._id;
    if(!user){
        throw new ApiError(400 , "User must be logged in")
    }

    const{TestimonialId} = req.params;

    const validTestimonial = await Testimonial.findById(TestimonialId);
    if(!validTestimonial){
        throw new ApiError(
            400 ,
            "No such Testimonial exists"
        )
    } 

    const uploadComment = await Comment.create(
        {
            Testimonial: TestimonialId,
            user: user,
            comment
        }
    )

    if(!uploadComment){
        throw new ApiError(400 , "Something went wrong while uploading comment")
    }

    return res
    .status(200)
    .json(
        new ApiResponse(
            201,
            uploadComment,
            "Comment done successfully!"
        )
    )

}
)

const deleteComment = asyncHandler(async(req, res) => {

    const{commentId} = req.params
    const user = req.user?._id;

    if(user){
        throw new ApiError(
            400 , 
            "User must be logged in"
        )
    }

    const comment = await Comment.findById(commentId);
    if(!comment){
        throw new ApiError(
            400 , 
            "No such comment exists"
        )
    }

    if(comment.user.toString() != user.toString()){
        throw new ApiError(
            400 , 
            "Not a authorized user!"
        )
    }

    await comment.deleteOne();

    return res
    .status(200)
    .json(
        new ApiResponse(
            201 , 
            comment,
            "The following comment deleted successfully!"
        )
    )
    


})

const updatecomment = asyncHandler(async(req, res) => {
    const {CommentId} = req.params
    const user = req.user?._id;

    const{comment} = req.body
    if(!comment){
        throw new ApiError(
            400 , 
            "This field is required"
        )
    }

    const ValidUser = await Comment.findOne(
        {
            _id:CommentId,
            user:user
        }
    )

    if(!ValidUser){
        throw new ApiError(
            400 , 
            "You are not a valid user to delete this comment "
        )
    }

    const update = await Comment.findByIdAndUpdate(
        CommentId,
        {
            $set:{
                comment
            }
        },
        {
            new:true
        }
    )

    if(!update){
        throw new ApiError(
            400 , 
            "Can't Update the comment"
        )
    }

    return res
    .status(200)
    .json(
        new ApiResponse(
            201 , 
            update,
            "Comment updated successfully!"
        )
    )
})



export{
    uploadComment,
    deleteComment,
    updatecomment,
    getAllComment
}