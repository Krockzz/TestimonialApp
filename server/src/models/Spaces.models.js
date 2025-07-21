import mongoose , {Schema} from "mongoose"
import mongooseAggregatePaginate from "mongoose-aggregate-paginate-v2"

const SpaceSchema = new Schema({

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
        trim: true,
    },
    avatar: {
        type: String, // This would be taken from the cloudinary
        required: true

    },

}, {timestamps: true})

SpaceSchema.plugin(mongooseAggregatePaginate);

export const Spaces = mongoose.model("Spaces" , SpaceSchema)