import {ApiError} from "../utils/ApiError.js"
import {ApiResponse} from "../utils/ApiResponse.js"
import {asyncHandler} from "../utils/asyncHandler.js"
import {User } from "../models/User.models.js"
// import {sendEmail} from "../utils/nodemailer.js"
import jwt from "jsonwebtoken"
import { Spaces } from "../models/Spaces.models.js"
import { sendEmail } from "../utils/resend.js"



const GenerateAccessandRefreshToken = async(userId) => {

    try{
        const user = await User.findById(userId);
        const accessToken =  user.GenerateAccessTokens();
        const refreshTokens =  user.GenerateRefreshTokens();

        user.refreshTokens = refreshTokens
       await user.save({validateBeforeSave:false});

       return {accessToken , refreshTokens}

    }
    catch(error){
        throw new ApiError(
            400,
            "Something went wrong while generating tokens!"
        )

    }

}

const GenerateResetToken = async(email) => {
    try{

        const user = await User.findOne({email})
        if(!user){
            throw new ApiError(
                400 , 
                "No such user exists!"
            )
        }
        const resetToken = await user.GenerateResetTokens();
        // console.log(resetToken)


        user.resetToken = resetToken;
        await user.save({validateBeforeSave:false})

        return {resetToken}

    }
    catch(error){
        throw new ApiError(
            400 , 
            "Wrong!"
        )
    }

}

const getUserSpaceCount = async(userId) => {

    try{
    const user = await User.findById(userId)
    if(!user){
        throw new ApiError(
            400,
            "No such user Exists!"
        )
    }

    const spacecount = await Spaces.countDocuments({user:user})
   

    

    return {spacecount};

    
}
catch (error) {
    throw new ApiError(500, `Something went wrong: ${error.message}`);
}


}
   
const RegisterUser = asyncHandler(async (req , res) => {
 await new Promise((resolve) => setTimeout(resolve , 3000))
    const {Username, email, password}  = req.body;

    if(
        [Username , email, password].some((field) => field?.trim() === " ")
    ){
        throw new ApiError(
            400,
            "All fields are required!"
    )
    }

    const existedUser = await User.findOne({
        $or: [{Username} , {email}]
    })

    if(existedUser){
        res.status(400).json({
            message:"User with this username or email already exists!",
            field: existedUser.email === req.body.email? 'email' : 'Username'

        })
    }

    

    const user = await User.create({
        Username,
        email,
        password,
        // Spaces: Spaces?.count() || "",
    })

    const createdUser = await User.findById(user._id).select(
        "-password -refreshTokens" 
    )

    if(!createdUser){
        throw new ApiError(
            400,
            "Something went wrong while registering the user"
        )
    }

    return res.json(
        new ApiResponse(
            200 ,
            createdUser,
            "User registered successfully"
        )
        
    )







})

const loginUser = asyncHandler(async(req, res) => {

    await new Promise((resolve) => setTimeout(resolve, 3000));
    const{email , password} = req.body

    if(!(email || password)){
        throw new ApiError(
            400,
            "Both fields are required!"
        )
    }

    const user = await User.findOne({
        email
    })

    if(!user){
        throw new ApiError(
            400 , 
            "Unauthorized User"
        )
    }

    const isPasswordValid = await user.isPasswordCorrect(password)

    if (!isPasswordValid) {
        throw new ApiError(401, "Invalid user credentials")
        }
     
       const {accessToken, refreshTokens} = await GenerateAccessandRefreshToken(user._id)

       const loggedInUser = await User.findById(user._id).select("-password -refreshTokens")

       const {spacecount} = await getUserSpaceCount(user._id);
    //    console.log(spaceCount)

       if(spacecount > 0){
        user.Spaces = spacecount
       }
       else{
        user.Spaces = 0
       }

       const options =  {
       httpOnly: true,
       secure: false,
  sameSite: "Lax",
  path: "/",

       }

       return res
       .status(200)
       .cookie("accessToken" , accessToken, options)
       .cookie("refreshTokens" , refreshTokens , options)
       .json(
        new ApiResponse(
            200 ,
            {
            user: loggedInUser , accessToken , refreshTokens, spacecount
            }, 

            "User logged in successfully"
        )
       )




})

const logoutUser = asyncHandler(async(req, res) => {
    
    await new Promise((resolve) => setTimeout(resolve, 2000))

    if (!req.user || !req.user._id) {
    return res.status(400).json(new ApiResponse(400, {}, "Invalid user"));
  }

  

   await User.findByIdAndUpdate(
       req.user._id,
       {
           $unset: {
               refreshTokens: 1 // this removes the field from document
           }
       },
       {
           new: true
       }
   )

   const options = {
       httpOnly: true,
       secure: false,
       sameSite: "Lax",
       path: "/", // ⬅️ important!
    //    maxAge: 7 * 24 * 60 * 60 * 1000,
   }

   return res
   .status(200)
   .clearCookie("accessToken", options)
.clearCookie("refreshTokens", options)

   .json(new ApiResponse(200, {}, "User logged Out"))
})



const RefreshAccessToken = asyncHandler(async(req, res) => {
    try{

    const IncommingRefreshToken = req.cookies?.refreshTokens || req.body
    if(!IncommingRefreshToken){
        throw new ApiError(
            401 ,
            "Unauthoriezed access"
        )
    }

    const decodedToken = jwt.verify(IncommingRefreshToken , process.env.REFRESH_ACCESS_SECRET)
    const user = await User.findById(decodedToken?._id)

    if(!user){
        throw new ApiError(
            400,
            "Such user doesn't exists"
        )
    }

    if(IncommingRefreshToken !== user?.refreshTokens){
        throw new ApiError("Refresh Token is expired or used!")
    }

    const options  = {
    httpOnly : true,
    secure  : true
    }
   const {accessToken, newRefreshToken} = await GenerateAccessandRefreshToken(user._id)

   return res
   .status(200)
   .cookie("accessToken" , accessToken , options)
   .cookie("refreshTokens" , newRefreshToken , options)
   .json(
     new ApiResponse(
        200,
       { 
        refreshTokens : newRefreshToken
    },
     "Refresh Token generated successfully"
       

    )
)

}
catch(error){
    throw new ApiError(401 , error?.message || "Invalid Refresh Token")
}




})

const changePassword = asyncHandler(async(req, res) => {

    const{oldPassword , newPassword} = req.body

    const user = await User.findOne(req.user?._id)

    const passwordVerification = await user.isPasswordCorrect(oldPassword)

    if(!passwordVerification){
        throw new ApiError(
            400,
            "Inavlid Password!"
        )
    }

    user.password = newPassword
    const update = await user.save({validateBeforeSave:false})

    if(!update){
        throw new ApiError(
            400,
            "Something went wrong while updating the password!"
        )
    }
    return res
    .status(200)
    .json(
        new ApiResponse(
            200,
            update,
            "Password updated successfully"
        )
    )

})

const updateUser = asyncHandler(async(req, res) => {
    const{Username , email} = req.body;

    if(!(Username || email)){
        throw new ApiError(
            400 , 
            "Any of the following fields are required"
        )
    }

    const updateUser = await User.findByIdAndUpdate(
        req.user?._id,
        {
            $set:{
                Username,
                email
            }
        },
        {
            new : true
        }

    )

    if(!updateUser){
        throw new ApiError(
            400 , 
            "Something went wrong while updating the User!"
        )
    }

    return res
    .status(200)
    .json(
        new ApiResponse(201 , updateUser  , "User updated successfully!")
    )


})

const getUserInfo = asyncHandler(async(req, res) => {

    if(!req.user){
        throw new ApiError(
            400 , 
            "User is not Logged in"
        )
    }

    const UserInfo = {
        id : req.user?._id,
        email: req.user?.email,
        Username: req.user?.Username

    }

    return res
    .status(200)
    .json(
        new ApiResponse(201, UserInfo , "User is Logged In")
    )
})

const forgotPassword = asyncHandler(async(req, res) => {

    const{email} = req.body
    const {resetToken} = await GenerateResetToken(email);

    // console.log(resetToken)

    
     const resetLink = `${process.env.FRONTEND_URL}/reset-password/${resetToken}`
     console.log(resetLink)
    const emailSent = await sendEmail(
        email,
        "Password Reset Request",
        `<p>Click the link below to reset your password:</p>
         <a href="${resetLink}">${resetLink}</a>
         <p>This link expires in 1 hour.</p>`
    );

    if(!emailSent){
        throw new ApiError(
            400 , 
            "Something went wrong while sending the email"
        )
    }

    return res
    .status(200)
    .json(
        new ApiResponse(
            201,
            emailSent,
            "Email sent successfully!"
        )
    )


})

const checker = asyncHandler(async(req , res) => {

    const token  = req.cookies.accessToken;
    if(!token){
        throw new  ApiError(
            400 , 
            "Not Authenticated"
        )
    }

    const decoded = jwt.verify(token , process.env.ACCESS_TOKEN_SECRET);
    return res
    .status(200)
    .json(
        new ApiResponse(
            201 ,
            
        )
    )
})




export {
    RegisterUser,
    loginUser,
    logoutUser,
    changePassword,
    RefreshAccessToken,
    updateUser,
    forgotPassword,
    getUserInfo
}



