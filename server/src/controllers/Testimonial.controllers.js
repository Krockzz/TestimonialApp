import { Testimonial } from "../models/Testimonials.models.js";
import { Spaces } from "../models/Spaces.models.js";
import { ApiError } from "../utils/ApiError.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import { uploadOnCloudinary } from "../utils/cloudinary.js";
import mongoose from "mongoose";
import { extractTweetId } from "../utils/extractTweetId.js";
import { fetchTweetById } from "../utils/twitterService.js";
import { analyzeSentiment } from "../utils/sentiment.js";
import {detectSpam} from "../utils/spamDetector.js"
import { generateEmailToken , sendVerificationEmail } from "../utils/email.js";


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

const createTestimonial = asyncHandler(async (req, res) => {
  const { spaceId } = req.params;
  const { name, email, text, rating } = req.body;

  if (!mongoose.Types.ObjectId.isValid(spaceId)) {
    throw new ApiError(400, "Invalid space ID");
  }

  if (!name?.trim() || !email?.trim()) {
    throw new ApiError(400, "Name and email are required.");
  }

  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailRegex.test(email)) {
    throw new ApiError(400, "Please provide a valid email address.");
  }

  const numericRating = Number(rating);
  if (!numericRating || numericRating < 1 || numericRating > 5) {
    throw new ApiError(400, "Rating must be a number between 1 and 5.");
  }

  const space = await Spaces.findOne({
    _id: spaceId,
    user: req.user?._id
  });

  if (!space) {
    throw new ApiError(403, "Unauthorized access to space");
  }



  let videoURL = "";
  let isVideo = false;

  const videoFile = req.files?.videoURL?.[0];
  if (videoFile?.path) {
    const videoUpload = await uploadOnCloudinary(videoFile.path);
    videoURL = videoUpload?.secure_url || "";
    if (!videoURL) {
      throw new ApiError(500, "Failed to upload video.");
    }
    isVideo = true;
  }

  let avatarUrl = "";
  const avatarFile = req.files?.avatar?.[0];
  if (avatarFile?.path) {
    const avatarUpload = await uploadOnCloudinary(avatarFile.path);
    avatarUrl = avatarUpload?.secure_url || "";
  }

  if (!isVideo && !text?.trim()) {
    throw new ApiError(
      400,
      "Please provide either a text testimonial or a video."
    );
  }


  let sentimentData = null;

  if (!isVideo && text?.trim()) {
    try {
      const sentiment = await analyzeSentiment(text);

      sentimentData = {
        label: sentiment.label, // POSITIVE | NEGATIVE | NEUTRAL
        score: sentiment.score,
        processed: true
      };
    } catch (error) {
      sentimentData = {
        label: null,
        score: null,
        processed: false
      };
    }
  }


  const existingTestimonials = await Testimonial.find(
    {
      space: spaceId,
      sourceType: "customer",
      text: { $ne: "" }
    },
    { text: 1, _id: 0 }
  );

  const existingTexts = existingTestimonials.map(t => t.text);


  const spamResult = detectSpam({
    text: isVideo ? "" : text,
    email,
    sentimentLabel: sentimentData?.label,
    existingTexts
  });


  const testimonial = await Testimonial.create({
    space: spaceId,
    name,
    email,
    text: isVideo ? "" : text,
    videoURL: isVideo ? videoURL : "",
    avatar: avatarUrl,
    rating: numericRating,
    sentiment: sentimentData,

    
    status: spamResult.status,
    spam: spamResult.spam
  });

  const emailToken = generateEmailToken();

testimonial.emailVerification = {
  token: emailToken,
  sentAt: new Date(),
  expiresAt: new Date(Date.now() + 5 * 60 *  1000),
  verified: false
};

await testimonial.save();

sendVerificationEmail(email, emailToken).catch(err =>
  console.error("Verification email failed:", err.message)
);


  if (
    testimonial.status === "active" &&
    sentimentData?.processed &&
    ["POSITIVE", "NEGATIVE", "NEUTRAL"].includes(sentimentData.label)
  ) {
    const sentimentField = `sentimentStats.${sentimentData.label}`;

    await Spaces.findByIdAndUpdate(
      spaceId,
      { $inc: { [sentimentField]: 1 } },
      { new: false }
    );
  }


  res.status(201).json({
    success: true,
    message: "Testimonial created successfully",
    testimonial
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




const deleteTestimonial = asyncHandler(async (req, res) => {

  const { TestimonialId } = req.params;
  const user = req.user?._id;
  const { spaceId } = req.body;

  if (!mongoose.Types.ObjectId.isValid(TestimonialId)) {
    throw new ApiError(400, "Invalid testimonial ID");
  }

  if (!mongoose.Types.ObjectId.isValid(spaceId)) {
    throw new ApiError(400, "Invalid space ID");
  }


  const space = await Spaces.findOne({ _id: spaceId, user });
  if (!space) {
    throw new ApiError(403, "You do not have access to this space");
  }

  const testimonial = await Testimonial.findOne({
    _id: TestimonialId,
    space: spaceId
  });

  if (!testimonial) {
    throw new ApiError(404, "Testimonial not found");
  }

  
  const sentimentLabel =
    testimonial?.sentiment?.processed &&
    ["POSITIVE", "NEUTRAL", "NEGATIVE"].includes(testimonial.sentiment.label)
      ? testimonial.sentiment.label
      : null;

  
  await testimonial.deleteOne();

  if (sentimentLabel) {
    const sentimentField = `sentimentStats.${sentimentLabel}`;

    await Spaces.findByIdAndUpdate(
      spaceId,
      { $inc: { [sentimentField]: -1 } },
      { new: false }
    );
  }

  return res.status(200).json(
    new ApiResponse(200, null, "Testimonial deleted successfully")
  );
});


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

const verifyEmail = asyncHandler(async (req, res) => {
  const { token } = req.query;

  const testimonial = await Testimonial.findOne({
    "emailVerification.token": token
  });

  if (!testimonial) {
    throw new ApiError(400, "Invalid or expired token");
  }

  // Already verified
  if (testimonial.emailVerification.verified) {
    return res.json({
      success: true,
      message: "Email already verified"
    });
  }

  const now = new Date();
  const sentAt = testimonial.emailVerification.sentAt;

  const FIVE_MINUTES = 5 * 60 * 1000;
  const isExpired = sentAt && now - sentAt > FIVE_MINUTES;

  
  testimonial.emailVerification.verified = true;
  testimonial.emailVerification.verifiedAt = now;

  
  if (isExpired) {
    const reason = "Email verification exceeded 5 minutes";

    if (!testimonial.spam.reasons.includes(reason)) {
      testimonial.spam.reasons.push(reason);
    }

    testimonial.spam.score = Math.max(testimonial.spam.score, 5);

    if (testimonial.spam.score >= 5) {
      testimonial.status = "spam";
    }
  } else {
 
    testimonial.spam.score = Math.max(0, testimonial.spam.score - 2);

    if (testimonial.spam.score < 5) {
      testimonial.status = "active";
    }
  }

  await testimonial.save();

  res.json({
    success: true,
    verifiedLate: isExpired,
    status: testimonial.status,
    spamScore: testimonial.spam.score,
    message: isExpired
      ? "Email verified, but verification was delayed."
      : "Email verified successfully"
  });
});




const toggleFeaturedTestimonial = asyncHandler(async (req, res) => {
  const { testimonialId } = req.params;

  if (!mongoose.Types.ObjectId.isValid(testimonialId)) {
    throw new ApiError(400, "Invalid testimonial ID");
  }

  const testimonial = await Testimonial.findById(testimonialId);

  if (!testimonial) {
    throw new ApiError(404, "Testimonial not found");
  }


  const space = await Spaces.findOne({
    _id: testimonial.space,
    // user: req.user?._id
  });

  if (!space) {
    throw new ApiError(403, "Unauthorized access to this testimonial");
  }

  const isCurrentlyFeatured = testimonial.featured?.enabled === true;

  testimonial.featured.enabled = !isCurrentlyFeatured;
  testimonial.featured.at = !isCurrentlyFeatured ? new Date() : null;

 
  if (isCurrentlyFeatured) {
    testimonial.featured.order = null;
  }

  await testimonial.save();

  res.status(200).json({
    success: true,
    message: testimonial.featured.enabled
      ? "Testimonial added to Wall of Love"
      : "Testimonial removed from Wall of Love",
    featured: testimonial.featured
  });
});






export {
createTestimonial,
deleteTestimonial,
updateTestimonial,
updateVideo,
getAllTestimonial,
likecontroller,
getTestimonialById,
importTweetAsTestimonial,
verifyEmail,
toggleFeaturedTestimonial
}