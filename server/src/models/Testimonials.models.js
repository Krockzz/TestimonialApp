import mongoose ,{Schema} from "mongoose";
import mongooseAggregatePaginate from "mongoose-aggregate-paginate-v2";

const TestimonialSchema = new Schema({

    space: {
        type: Schema.Types.ObjectId,
        ref: "Spaces",
        required: true
    },

    name: {
        type:String,
        required: true,
        index: true,
        trim: true,
        lowercase: true
    } , 

    email: {
        type: String,
        required: true
    } , 
    text: {
        type: String,
        // required: true,
    } , 

    videoURL: {
        type: String, // This would be taken from the cloudinary
        
    } ,

    avatar: {
        type: String // This would also be taken from the cloudinary
    }
    ,

    rating: {
  type: Number,
  min: 1,
  max: 5,
  default: 5,
  required: true
},

    comment: {
        type: Schema.Types.ObjectId,
        ref: "Comment"
    },

    likes: [{ type: Schema.Types.ObjectId, 
        ref: "User" 
    }],
} , 
{timestamps : true}
)

TestimonialSchema.plugin(mongooseAggregatePaginate);

export const Testimonial = mongoose.model("Testimonial" , TestimonialSchema)