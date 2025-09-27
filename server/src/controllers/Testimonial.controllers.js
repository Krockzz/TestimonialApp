import { Testimonial } from "../models/Testimonials.models.js";
import { Spaces } from "../models/Spaces.models.js";
import { ApiError } from "../utils/ApiError.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import { uploadOnCloudinary } from "../utils/cloudinary.js";
import mongoose from "mongoose";
import { extractTweetId } from "../utils/extractTweetId.js";
import { fetchTweetById } from "../utils/twitterService.js";


const getAllTestimonial = asyncHandler(async (req, res) => {
  const { spaceId } = req.params;
  if (!spaceId) {
    throw new ApiError(400, "SpaceId is required!");
  }

  if (!mongoose.Types.ObjectId.isValid(spaceId)) {
    throw new ApiError(400, "Invalid space ID");
  }

  const { page = 1, limit = 10 } = req.query;
  const options = {
    page: parseInt(page, 10),
    limit: parseInt(limit, 10),
    sort: { createdAt: -1 },
  };

  const aggregationPipeline = [
    {
      $match: {
        space: new mongoose.Types.ObjectId(spaceId),
      },
    },
    {
      $lookup: {
        from: "comments",
        localField: "_id",
        foreignField: "Testimonial",
        as: "comments",
      },
    },
    {
      $addFields: {
        totalcomments: { $size: "$comments" },
      },
    },
    {
      $project: {
        comments: 0,
      },
    },
  ];

  const aggregate = Testimonial.aggregate(aggregationPipeline);
  const result = await Testimonial.aggregatePaginate(aggregate, options);

  if (!result) {
    throw new ApiError(
      400,
      "Something went wrong while fetching the testimonials"
    );
  }

  return res.status(200).json({
    success: true,
    message: "Testimonials fetched successfully",
    data: result,
  });
});

import asyncHandler from "express-async-handler";
import mongoose from "mongoose";
import ApiError from "../utils/ApiError.js";
import Spaces from "../models/Spaces.models.js";
import Testimonial from "../models/Testimonial.models.js";
import { uploadOnCloudinary } from "../utils/cloudinary.js";

const createTestimonial = asyncHandler(async (req, res) => {
  const { spaceId } = req.params;
  const { name, email, text, rating } = req.body;

  // Validate space ID
  if (!mongoose.Types.ObjectId.isValid(spaceId)) {
    throw new ApiError(400, "Invalid space ID");
  }

  // Validate name and email
  if (!name?.trim() || !email?.trim()) {
    throw new ApiError(400, "Name and email are required.");
  }

  const rawRating = req.body.rating?.trim?.() || req.body["rating "]?.trim?.();
  const Newrating = Number(rawRating);

  if (!Newrating || Newrating < 1 || Newrating > 5) {
    throw new ApiError(400, "Rating must be a number between 1 and 5.");
  }

  // Check access to the space
  const space = await Spaces.findOne({
    _id: spaceId,
    user: req.user?._id,
  });

  if (!space) {
    throw new ApiError(403, "Unauthorized access to space");
  }

  // Handle video
  let videoURL = "";
  let isVideo = false;

  const videoFile = req.files?.videoURL?.[0];
  if (videoFile?.buffer) {
    const videoUpload = await uploadOnCloudinary(videoFile.buffer, `testimonial-video-${Date.now()}`);
    videoURL = videoUpload?.secure_url || "";
    if (!videoURL) {
      throw new ApiError(500, "Failed to upload video to Cloudinary.");
    }
    isVideo = true;
  } else if (!text?.trim()) {
    throw new ApiError(400, "Please provide either a text testimonial or a video.");
  }

  // Handle avatar
  let avatarUrl = "";
  const avatarFile = req.files?.avatar?.[0];
  if (avatarFile?.buffer) {
    const avatarUpload = await uploadOnCloudinary(avatarFile.buffer, `testimonial-avatar-${Date.now()}`);
    avatarUrl = avatarUpload?.secure_url || "";
  }

  // Create testimonial
  const testimonial = await Testimonial.create({
    space: spaceId,
    name,
    email,
    text: isVideo ? "" : text,
    videoURL: isVideo ? videoURL : "",
    avatar: avatarUrl,
    rating: Newrating,
  });

  res.status(201).json({
    success: true,
    message: "Testimonial created successfully",
    testimonial,
  });
});




const importTweetAsTestimonial = asyncHandler(async (req, res) => {

  await new Promise((resolve) => setTimeout(resolve , 10000))
  const {spaceId} = req.params;
  const { tweetUrl } = req.body;

  // Validate inputs
  if (!tweetUrl || !spaceId) {
    throw new ApiError(400, "Tweet URL and Space ID are required!");
  }

  if (!mongoose.Types.ObjectId.isValid(spaceId)) {
    throw new ApiError(400, "Invalid Space ID");
  }

  // Ensure the space belongs to the current user
  const space = await Spaces.findOne({ _id: spaceId, user: req.user?._id });
  if (!space) {
    throw new ApiError(403, "You are not authorized to add testimonials to this space.");
  }

  // Extract Tweet ID
  const tweetId = extractTweetId(tweetUrl);
  if (!tweetId) {
    throw new ApiError(400, "Invalid tweet URL format");
  }

  // Fetch tweet data from Twitter API
  const tweetData = await fetchTweetById(tweetId);
  const tweet = tweetData.data;
  const user = tweetData.includes.users[0];

  // Save the tweet as a testimonial
  const testimonial = await Testimonial.create({
    space: spaceId,
    text: tweet.text,
    avatar: user.profile_image_url,
    sourceType: "twitter",
    twitterData: {
      tweetId: tweet.id,
      twitterHandle: user.username,
      twitterName: user.name,
      likeCount: tweet.public_metrics.like_count,
      originalTweetUrl: `https://twitter.com/${user.username}/status/${tweet.id}`,
    },
  });

  return res.status(201).json(
    new ApiResponse(201, testimonial, "Tweet imported successfully")
  );
});


const getTestimonialById = asyncHandler(async (req, res) => {
  const { TestiId } = req.params;

  if (!mongoose.Types.ObjectId.isValid(TestiId)) {
    throw new ApiError(400, "Invalid testimonial ID");
  }

  if (!TestiId) {
    throw new ApiError(400, "This field is required!");
  }

  // Populate the related Space to access its avatar
  const testimonial = await Testimonial.findById(TestiId).populate("space");

  if (!testimonial) {
    throw new ApiError(400, "Testimonial doesn't exist!");
  }

  // If testimonial doesn't have an avatar, fallback to space's avatar
  if (!testimonial.avatar && testimonial.space?.avatar) {
    testimonial.avatar = testimonial.space.avatar;
  }

  return res
    .status(200)
    .json(
      new ApiResponse(
        200,
        testimonial,
        "Testimonial fetched successfully"
      )
    );
});




const deleteTestimonial = asyncHandler(async(req, res) => {

  // await new Promise((resolve) => setTimeout(resolve, 4000))

    const {TestimonialId} = req.params;
    
    const user = req.user?._id;
    const {spaceId} = req.body;

    if (!mongoose.Types.ObjectId.isValid(TestimonialId)) {
  throw new ApiError(400, "Invalid space ID");
}

if (!mongoose.Types.ObjectId.isValid(spaceId)) {
    throw new ApiError(400, "Invalid space ID");
  }


    const space = await Spaces.findOne({ _id: spaceId, user: user });
  if (!space) {
    throw new ApiError(403, "You do not have access to this space");
  }

    

    // const spaceId = space._id;

    const Testimonials  = await Testimonial.findOne({
        _id: TestimonialId,
        space:spaceId
    })

    if(!Testimonials){
        throw new ApiError(
            400,
            "User is not authorized user"
        )
    }

    await Testimonials.deleteOne();
    return res.status(200).json(
        new ApiResponse(200, null, "Testimonial deleted successfully")
    );


})

const updateTestimonial = asyncHandler(async(req , res) => {
    const {TestimonialId} = req.params;
    if(!TestimonialId){
        throw new ApiError(
            400 , 
            "This field is required"
        )
    }
    const user = req.user?._id;
    const Testimonials = await Testimonial.findOne({_id:TestimonialId}).populate({
        path:"Spaces",
        match:{
            user:user

        }
    })

    if(!Testimonials){
        throw new ApiError(400 , 
            "The following user is not a authorized one!"
        )
    }
    const{name, email, text} = req.body;

    const updateTestimonial = await Testimonial.findByIdAndUpdate(
        TestimonialId,
        {
            $set:{
                name,
                email,
                text
            }
        },
        {
            new:true
        }
    )

    if(!updateTestimonial){
        throw new ApiError(400 , 
            "Something went wrong while updating the details"
        )
    }

    return res
    .status(200)
    .json(
        new ApiResponse(
            201,
            updateTestimonial,
            "Testimonial Updated Successfully!"
        )
    )
    





})

const updateVideo = asyncHandler(async(req, res) => {
    const{TestimonialId} = req.params
    const {path} = req.file?.path;

    if(!path){
        throw new ApiError(
            400 , 
            "Path is required"
        )
    }

    const user = req.user?._id;
    const Testimonials = await Testimonial.findOne({_id:TestimonialId}).populate({
        path:"Spaces",
        match:{
            user:user
        }
    })

    if(!Testimonials){
        throw new ApiError(
            400 , 
            "User is not the authorized user!"
        )
    }

    const video = await uploadOnCloudinary(path);
    if(!video.url){
        throw new ApiError(
            400 , 
            "Something went wrong while uploading on cloudinary"
        )
    }

    const videoUpdate = await Testimonial.findByIdAndUpdate(
        TestimonialId,
        {
            $set:{
                videoURL:video?.url
            }
        },
        {
            new:true
        }
    )

    if(!videoUpdate){
        throw new ApiError(
            400,
            "Something went wrong while updating the video"
        )
    }

    return res
    .status(200)
    .json(
        new ApiResponse(
            201 ,
            videoUpdate,
            "VideoUpdated Successfully"
        )
    )

})

const likecontroller = asyncHandler(async(req, res) => {

    const{TestimonialId} = req.params;
    const user = req.user?._id;

    const like = await Testimonial.findById(TestimonialId);
    if(!TestimonialId){
        throw new ApiError(
            400 , 
            "No such Testimonial exists"
        )
    }

    const index = await like.likes.indexOf(user);
    if(index === -1){
        like.likes.push(user);

    }
    else{
        like.likes.splice(index, 1)

    }

    await like.save();

    return res
    .status(200)
    .json(
        new ApiResponse(
            201 , like, "Like status updated successfully!"
        )
    )
})



export {
createTestimonial,
deleteTestimonial,
updateTestimonial,
updateVideo,
getAllTestimonial,
likecontroller,
getTestimonialById,
importTweetAsTestimonial
}