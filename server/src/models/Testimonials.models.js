import mongoose, { Schema } from "mongoose";
import mongooseAggregatePaginate from "mongoose-aggregate-paginate-v2";

const TestimonialSchema = new Schema(
  {
    space: {
      type: Schema.Types.ObjectId,
      ref: "Spaces",
      required: true
    },

    // For customer-uploaded testimonials
    name: {
      type: String,
      trim: true,
      lowercase: true,
      index: true
    },

    email: {
      type: String
    },

    text: {
      type: String, // testimonial text or tweet text
    },

    videoURL: {
      type: String, // Cloudinary video
    },

    avatar: {
      type: String, // customer avatar or twitter profile pic
    },

    rating: {
      type: Number,
      min: 1,
      max: 5,
      default: 5
    },

    comment: {
      type: Schema.Types.ObjectId,
      ref: "Comment"
    },

    likes: [
      {
        type: Schema.Types.ObjectId,
        ref: "User" // likes inside your app
      }
    ],

    // ---------- TWITTER IMPORT DATA ----------
    twitterData: {
      tweetId: { type: String }, // for linking back to the original tweet
      twitterHandle: { type: String }, // e.g. @elonmusk
      twitterName: { type: String }, // Full display name
      likeCount: { type: Number }, // Twitter like count
      originalTweetUrl: { type: String } // Full tweet URL
    },

    // Identify where the testimonial came from
    sourceType: {
      type: String,
      enum: ["customer", "twitter"],
      required: true,
      default: "customer"
    }
  },
  { timestamps: true }
);

TestimonialSchema.plugin(mongooseAggregatePaginate);

export const Testimonial = mongoose.model("Testimonial", TestimonialSchema);
