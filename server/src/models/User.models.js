import mongoose , {Schema} from "mongoose"
import bcrypt from "bcrypt"
import jwt from "jsonwebtoken"

const UserSchema = new Schema(
    
    {
     Username: {
            type: String,
            required: true,
            index: true,
            lowercase: true,
            trim: true
   },
    email: {
        type: String,
        required: true,
        unique: true,
        lowercase: true,
        trim: true
},

   password: {
    type: String,
    required: true,
    trim: true

},

   Spaces: {
    type: Schema.Types.ObjectId,
    ref: "Spaces",

},


  refreshTokens: {
    type: String,
    // required: true
},

resetToken: {
    type:String,
    default: null
},

resetTokenExpires: {
    type: String,
    default: null

}
} , 
{timestamps: true}

)


UserSchema.pre("save" , async function(next){
    if(!this.isModified("password")){
        return next();
    }

    this.password = await bcrypt.hash(this.password , 10) ;
    next();
})

UserSchema.methods.isPasswordCorrect = async function(password){
    return await bcrypt.compare(password , this.password);
}

UserSchema.methods.GenerateAccessTokens =  function(){
    return jwt.sign({
        _id: this._id,
        username: this.username,
        email: this.email

    },

    process.env.ACCESS_TOKEN_SECRET,

    {
        expiresIn: process.env.ACCESS_TOKEN_EXPIRY
    }

)
}



UserSchema.methods.GenerateRefreshTokens =  function(){

    return jwt.sign ({
        _id: this._id,
       
    },
    process.env.REFRESH_TOKEN_SECRET,
    {
        expiresIn: process.env.REFRESH_TOKEN_EXPIRY
    }
)

}

UserSchema.methods.GenerateResetTokens = function(){
    return jwt.sign ({
        _id: this._id
    },

    process.env.RESET_TOKEN_SECRET
,{
    expiresIn:process.env.RESET_TOKEN_EXPIRY
})
}

export const User = mongoose.model("User" , UserSchema);

