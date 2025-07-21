import mongoose , {Schema} from "mongoose"
import mongooseAggregatePaginate from "mongoose-aggregate-paginate-v2"

const CommentSchema = new Schema(
    {
        Testimonial:{
            type: Schema.Types.ObjectId,
            ref: "Testimonial",
            required: true

        } , 

        user: {
            type: Schema.Types.ObjectId,
            ref: "User", 
            required: true

        } ,

        comment: {
            type: String, 
            required: true

        } ,





    } ,
     {timestamps: true}
    )

    CommentSchema.plugin(mongooseAggregatePaginate)

    export const Comment = mongoose.model("Comment" , CommentSchema)