import mongoose, { Schema } from "mongoose";
import mongooseAggregatePaginate from "mongoose-aggregate-paginate-v2";

const SpaceSchema = new Schema(
  {
    user: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true
    },

    name: {
      type: String,
      required: true,
      unique: true,
      trim: true,
      lowercase: true,
      index: true
    },

    HeaderTitle: {
      type: String,
      required: true
    },

    customMessage: {
      type: String,
      required: true
    },

    description: {
      type: String,
      trim: true
    },

    avatar: {
      type: String,
      required: true
    },

    sentimentStats: {
      POSITIVE: { type: Number, default: 0 },
      NEUTRAL: { type: Number, default: 0 },
      NEGATIVE: { type: Number, default: 0 }
    },

    insights: {
      strengths: { type: String, default: "" },
      improvements: { type: String, default: "" },
      lastGeneratedAt: { type: Date }
    },

    insightVersion: {
      type: Number,
      default: 1
    }
  },
  { timestamps: true }
);

SpaceSchema.plugin(mongooseAggregatePaginate);

export const Spaces = mongoose.model("Spaces", SpaceSchema);
