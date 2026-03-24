import { asyncHandler } from "../utils/asyncHandler.js";
import { ApiError } from "../utils/ApiError.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { uploadOnCloudinary } from "../utils/cloudinary.js";
import { Spaces } from "../models/Spaces.models.js";
import { Testimonial } from "../models/Testimonials.models.js";
import mongoose from "mongoose";
import { summarize } from "../utils/summarize.js";
import { dedupeTexts } from "../utils/duplicate_Text.js";

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
                from: "testimonials", 
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
          })

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


  const avatarFile = req.files?.avatar?.[0];
  if (!avatarFile?.path) {
    throw new ApiError(400, "Avatar is missing");
  }

  // Upload avatar from disk to Cloudinary
  const avatarResult = await uploadOnCloudinary(avatarFile.path);
  if (!avatarResult?.secure_url) {
    throw new ApiError(500, "Failed to upload avatar to Cloudinary");
  }

  const space = await Spaces.create({
    user,
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
          })

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
  const avatarFile = req.file; // now using diskStorage, so path exists

  const user = req.user?._id;

  const space = await Spaces.findById(spaceId);
  if (!space) {
    throw new ApiError(404, "Space not found");
  }

  if (space.user.toString() !== user.toString()) {
    throw new ApiError(403, "You are not authorized to update this space");
  }

  if (!avatarFile?.path) {
    throw new ApiError(400, "Avatar file is required");
  }

  // Upload avatar from disk to Cloudinary
  const avatarResult = await uploadOnCloudinary(avatarFile.path);
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

const generateSpaceInsights = asyncHandler(async (req, res) => {
  const { SpaceId } = req.params;
  const userId = req.user?._id;

  if (!mongoose.Types.ObjectId.isValid(SpaceId)) {
    throw new ApiError(400, "Invalid space ID");
  }

  const space = await Spaces.findOne({ _id: SpaceId, user: userId });
  if (!space) throw new ApiError(403, "Unauthorized access to space");

  const testimonials = await Testimonial.find({
    space: SpaceId,
    "sentiment.processed": true,
  }).select("text sentiment.label");

  if (!testimonials.length) {
    throw new ApiError(400, "Not enough testimonials to generate insights");
  }

  const positiveNeutralRaw = [];
  const negativeRaw = [];

  for (const t of testimonials) {
    if (!t.text?.trim()) continue;
    if (t.sentiment.label === "NEGATIVE") negativeRaw.push(t.text);
    else positiveNeutralRaw.push(t.text);
  }

  const positiveNeutral = dedupeTexts(positiveNeutralRaw).join(". ");
  const negative = dedupeTexts(negativeRaw).join(". ");

  const positiveSummary =
    positiveNeutral.length >= 80
      ? await summarize(positiveNeutral, "strengths")

      : "";

  const negativeSummary =
    negative.length >= 80
      ? await summarize(negative, "improvements")

      : "";

  const strengths = positiveSummary || "Not enough positive feedback to generate insights.";
  const improvements = negativeSummary || "No major issues reported by users.";


  space.insights = {
    strengths: String(strengths),
    improvements: String(improvements),
    lastGeneratedAt: new Date(),
  };

  space.insightVersion += 1;
  await space.save();

  return res.status(200).json(
    new ApiResponse(200, space.insights, "Insights generated successfully")
  );
});
const getSpaceAnalytics = asyncHandler(async (req, res) => {

  const { SpaceId } = req.params;

  if (!mongoose.Types.ObjectId.isValid(SpaceId)) {
    throw new ApiError(400, "Invalid space Id");
  }

  const space = await Spaces.findById(SpaceId);

  if (!space) {
    throw new ApiError(404, "No such space exists");
  }

  const spaceObjectId = new mongoose.Types.ObjectId(SpaceId);

  const analytics = await Testimonial.aggregate([
    {
      $match: {
        space: spaceObjectId,
        // status: "active"
      }
    },
    {
      $facet: {

        submissionRate: [
          {
            $group: {
              _id: {
                year: { $year: "$createdAt" },
                month: { $month: "$createdAt" }
              },
              count: { $sum: 1 }
            }
          },
          {
            $sort: {
              "_id.year": 1,
              "_id.month": 1
            }
          }
        ],

        sentiment: [
          {
            $match: {
              "sentiment.label": { $exists: true }
            }
          },
          {
            $group: {
              _id: "$sentiment.label",
              count: { $sum: 1 }
            }
          }
        ],

        sourceDistribution: [
          {
            $group: {
              _id: "$sourceType",
              count: { $sum: 1 }
            }
          }
        ],

        totalTestimonials: [
          {
            $count: "count"
          }
        ]

      }
    }
  ]);

  const result = analytics[0];

  return res.status(200).json({
    totalTestimonials: result.totalTestimonials[0]?.count || 0,
    submissionRate: result.submissionRate || [],
    sentiment: result.sentiment || [],
    sourceDistribution: result.sourceDistribution || []
  });

});



export{
    createSpace,
    deleteSpace,
    updateSpace,
    updateAvatar,
    getAllSpaces,
    getSpaceById,
    generateSpaceInsights,
    getSpaceAnalytics
}
