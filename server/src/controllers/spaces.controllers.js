import { asyncHandler } from "../utils/asyncHandler.js";
import { ApiError } from "../utils/ApiError.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { uploadOnCloudinary } from "../utils/cloudinary.js";
import { Spaces } from "../models/Spaces.models.js";
import { Testimonial } from "../models/Testimonials.models.js";
import mongoose from "mongoose";

const getTestimonialCount = async(SpaceId) => {

    try{
        const space = await Spaces.findById(SpaceId);
        if(!space){
            throw new ApiError(400 , 
                "No space is available with this spaceId"
            )
        }

        const Testimonialcount = await Testimonial.countDocuments({
            space:SpaceId
        })

        
        return {Testimonialcount}


    }
    catch(error){
        throw new ApiError(500, `Something went wrong: ${error.message}`);
    }
}

const getAllSpaces = asyncHandler(async(req, res) => {
    const userId = req.user?._id;

    if(!userId){
        throw new ApiError(
            400 , 
            "UserId is required or the user is not logged in"
        )
    }

    const { page = 1, limit = 10 } = req.query;
    const options = {
        page: parseInt(page, 10),
        limit: parseInt(limit, 10),
        sort: { createdAt: -1 }, // Sort by newest first
    };

    const aggregationPipeline = Spaces.aggregate([
        { $match: { user: new mongoose.Types.ObjectId(userId) } }, 
        {
            $lookup:{
                from: "testimonials", // Collection name in MongoDB
                localField: "_id",
                foreignField: "space",
                as: "testimonials",
            }
        },

        {
            $addFields:{
                totalTestimonials: {$size: "$testimonials"}
            },
        },

        { $project: { testimonials: 0 } }
    ]);
    
    const result = await Spaces.aggregatePaginate(aggregationPipeline, options);

    // result.docs is the array of spaces on this page (depends on your pagination lib)
    if (!result) {
        // In case the aggregatePaginate failed totally, throw error
        throw new ApiError(400, "Error in fetching the spaces");
    }

    // If there are no spaces found, return empty array gracefully
    if (!result.docs || result.docs.length === 0) {
        return res.status(200).json({
            success: true,
            message: "No spaces found for this user",
            data: {
                docs: [],
                totalDocs: 0,
                limit: options.limit,
                page: options.page,
                totalPages: 0,
                hasNextPage: false,
                hasPrevPage: false,
                nextPage: null,
                prevPage: null
            }
        });
    }

    return res.status(200).json({
        success: true,
        message: "Spaces fetched successfully",
        data: result,
    });
});


const createSpace = asyncHandler(async (req, res) => {
  await new Promise((resolve) => setTimeout(resolve, 5000));

  const { name, HeaderTitle, customMessage, description } = req.body;

  if ([name, HeaderTitle, customMessage, description].some((field) => !field?.trim())) {
    throw new ApiError(400, "All the fields are required!");
  }

  const user = req.user?._id;
  if (!user) {
    throw new ApiError(400, "Login is required to create any space");
  }

  // Ensure avatar file exists
  const avatarFile = req.files?.avatar?.[0];
  if (!avatarFile) {
    throw new ApiError(400, "Avatar is missing");
  }

  // Upload avatar buffer to Cloudinary
  const avatarResult = await uploadOnCloudinary(avatarFile.buffer, `space-avatar-${Date.now()}`);
  if (!avatarResult?.secure_url) {
    throw new ApiError(500, "Failed to upload avatar to Cloudinary");
  }

  const space = await Spaces.create({
    user: user,
    name,
    HeaderTitle,
    customMessage,
    description,
    avatar: avatarResult.secure_url,
  });

  if (!space) {
    throw new ApiError(500, "Something went wrong while creating the space");
  }

  return res.status(200).json(new ApiResponse(200, space, "Space created successfully"));
});

export { createSpace };

const getSpaceById = asyncHandler(async(req, res) => {
    const{SpaceId} = req.params;
    if(!SpaceId){
        throw new ApiError(
            400 , 
            "This field is required!"
        )
    }

    const Space = await Spaces.findById(SpaceId);
    if(!Space){
        throw new ApiError(
            400 , 
            "Space doesn't exists!"
        )
    }

    const {Testimonialcount} = await getTestimonialCount(SpaceId);
    
    return res
    .status(200)
    .json(
        new ApiResponse(
            201 , 
            Space , Testimonialcount,
            "Space fetched successfully"
        )
    )
})

const deleteSpace = asyncHandler(async (req, res) => {

    // await new Promise((resolve) => setTimeout(resolve, 3000))
    const { spaceId } = req.body; // Space ID from URL parameters
    const user = req.user?._id; // User from request

    if (!user) {
        throw new ApiError(400, "Login is required to delete  space");
    }

    

    const space = await Spaces.findById(spaceId);
    if (!space) {
        throw new ApiError(404, "Space not found");
    }

    // Ensure that the logged-in user owns the space
    if (space.user.toString() !== user.toString()) {
        throw new ApiError(403, "You are not authorized to delete this space");
    }

    // Delete the space
    await space.deleteOne();

    return res.status(200).json(
        new ApiResponse(200, null, "Space deleted successfully")
    );
});

const updateSpace = asyncHandler(async(req , res) => {

    await new Promise((resolve) => setTimeout(resolve, 5000))

    const {spaceId , name , HeaderTitle , customMessage , description}  = req.body
    if(!(spaceId , name , HeaderTitle , customMessage , description)){
        throw new ApiError(
            400 ,
            "All the fields are required"
        )
    }
    const user = req.user?._id;

    const space = await Spaces.findById(spaceId);
    if(!space){
        throw new ApiError(400 ,
            "Space not found!"
        )
    }

    if (space.user.toString() !== user.toString()) {
        throw new ApiError(403, "You are not authorized to delete this space");
    }

    const SpaceUpdate = await Spaces.findByIdAndUpdate(
        spaceId,
        {
            $set:{
                name,
                HeaderTitle,
                customMessage,
                description
            }
        },
        {
            new:true
        }
    )

    if(!SpaceUpdate){
        throw new ApiError(400 , 
            "Something went wrong while updating the details!"
        )
    }

    return res.status(200).json(
        new ApiResponse(
            201 , 
            SpaceUpdate,
            "Details Updated successfully"
        )
    )



      
})

const updateAvatar = asyncHandler(async (req, res) => {
  const { spaceId } = req.body;
  const avatarFile = req.file; // Multer memory storage buffer

  const user = req.user?._id;

  const space = await Spaces.findById(spaceId);
  if (!space) {
    throw new ApiError(404, "Space not found");
  }

  if (space.user.toString() !== user.toString()) {
    throw new ApiError(403, "You are not authorized to update this space");
  }

  if (!avatarFile?.buffer) {
    throw new ApiError(400, "Avatar file is required");
  }

  // Upload avatar buffer to Cloudinary
  const avatarResult = await uploadOnCloudinary(avatarFile.buffer, `space-avatar-${Date.now()}`);
  if (!avatarResult?.secure_url) {
    throw new ApiError(500, "Something went wrong while uploading the file to Cloudinary");
  }

  // Update the space avatar
  const updatedSpace = await Spaces.findByIdAndUpdate(
    spaceId,
    { avatar: avatarResult.secure_url },
    { new: true }
  );

  if (!updatedSpace) {
    throw new ApiError(500, "Failed to update avatar");
  }

  return res.status(200).json(
    new ApiResponse(200, updatedSpace, "Avatar updated successfully")
  );
});

export { updateAvatar };


export{
    createSpace,
    deleteSpace,
    updateSpace,
    updateAvatar,
    getAllSpaces,
    getSpaceById
}