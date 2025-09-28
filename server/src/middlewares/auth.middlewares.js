import { asyncHandler } from "../utils/asyncHandler.js";
import { ApiError } from "../utils/ApiError.js";
import jwt from "jsonwebtoken"
import {User} from "../models/User.models.js"


export const verifyJwt = asyncHandler(async(req, res , next) => {
    

    const token = req.cookies?.accessToken || req.header("Authorization")?.replace("Bearer " , "")

    

    if(!token){
        throw new ApiError(
            400,
            "Unauthorized request!"
        )
    }
        

    // const decodedToken = jwt.verify(token , process.env.ACCESS_TOKEN_SECRET)

    console.log(token)

    let decodedToken;

try {
  decodedToken = jwt.verify(token, process.env.ACCESS_TOKEN_SECRET);
} catch (err) {
  console.error("JWT verification failed:", err.message);
  throw new ApiError(401, "Invalid or expired token");
}

    const user = await User.findById(decodedToken?._id).select("-password -refreshTokens")
    
        if (!user) {
            
            throw new ApiError(401, "Invalid Access Token")
        }

    
    
        req.user = user;
         next();
    
})