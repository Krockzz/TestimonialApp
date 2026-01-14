import mongoose, { Schema } from "mongoose";
import mongooseAggregatePaginate from "mongoose-aggregate-paginate-v2";

const TestimonialSchema = new Schema(
  {
    space: {
      type: Schema.Types.ObjectId,
      ref: "Spaces",
      required: true
    },

    name: {
      type: String,
      trim: true,
      lowercase: true,
      index: true
    },

    email: {
      type: String,
      index: true
    },

    text: {
      type: String
    },

    videoURL: {
      type: String
    },

    avatar: {
      type: String
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
        ref: "User"
      }
    ],

    twitterData: {
      tweetId: { type: String },
      twitterHandle: { type: String },
      twitterName: { type: String },
      likeCount: { type: Number },
      originalTweetUrl: { type: String },
      media: [
        {
          type: {
            type: String,
            enum: ["photo", "video", "animated_gif"]
          },
          url: { type: String },
          previewImageUrl: { type: String },
          durationMs: { type: Number }
        }
      ]
    },

    sourceType: {
      type: String,
      enum: ["customer", "twitter"],
      required: true,
      default: "customer"
    },

    sentiment: {
      label: {
        type: String,
        enum: ["POSITIVE", "NEGATIVE", "NEUTRAL"]
      },
      score: { type: Number },
      processed: { type: Boolean, default: false }
    },

    status: {
      type: String,
      enum: ["active", "spam", "deleted"],
      default: "active",
      index: true
    },

    
    featured: {
      enabled: {
        type: Boolean,
        default: false,
        index: true
      },
      at: {
        type: Date,
        default: null
      },
      order: {
        type: Number,
        default: null
      }
    },

    spam: {
      score: { type: Number, default: 0 },
      reasons: [{ type: String }]
    },

    emailVerification: {
      verified: { type: Boolean, default: false },
      token: { type: String },
      sentAt: { type: Date },
      verifiedAt: { type: Date }
    },

    submissionMeta: {
      ip: { type: String },
      userAgent: { type: String }
    }
  },
  { timestamps: true }
);

TestimonialSchema.plugin(mongooseAggregatePaginate);

export const Testimonial = mongoose.model("Testimonial", TestimonialSchema);
