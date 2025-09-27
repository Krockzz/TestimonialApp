import { Router } from "express";
import passport from "passport";
import { User } from "../models/User.models.js";
// import asyncHandler from "express-async-handler";
import { ApiError } from "../utils/ApiError.js";
import { asyncHandler } from "../utils/asyncHandler.js";

const router = Router();


const GenerateAccessandRefreshToken = async (user) => {
  try {
    const accessToken = user.GenerateAccessTokens();
    const refreshTokens = user.GenerateRefreshTokens();

    user.refreshTokens = refreshTokens;
    await user.save({ validateBeforeSave: false });

    return { accessToken, refreshTokens };
  } catch (error) {
    throw new ApiError(400, "Something went wrong while generating tokens!");
  }
};

// Step 1: Start Google Login
router.get(
  "/google",
  passport.authenticate("google", { scope: ["profile", "email"] })
);

// Step 2: Google Callback
router.get(
  "/google/callback",
  passport.authenticate("google", {
    failureRedirect: "https://testimonia-delta.vercel.app/login",
    session: false,
  }),
  asyncHandler(async (req, res) => {
    try {
      if (!req.user) {
        
        return res.redirect("https://testimonia-delta.vercel.app/login?error=true");
      }

      // Generate access and refresh tokens
      const { accessToken, refreshTokens } = await GenerateAccessandRefreshToken(req.user);

      // Cookie options
      const cookieOptions = {
        httpOnly: true,
        secure: true, // HTTPS only
        sameSite: "none", // cross-domain
        path: "/",
      };

      // Set cookies
      res.cookie("accessToken", accessToken, { ...cookieOptions, maxAge: 24 * 60 * 60 * 1000 }); // 1 day
      res.cookie("refreshToken", refreshTokens, { ...cookieOptions, maxAge: 7 * 24 * 60 * 60 * 1000 }); // 7 days

      // Redirect to frontend dashboard
      res.redirect("https://testimonia-delta.vercel.app/space");
    } catch (error) {
      console.error("Google login error:", error);
      res.redirect("https://testimonia-delta.vercel.app/login?error=true");
    }
  })
);

// Logout Route
router.get("/logout", asyncHandler(async (req, res) => {
  try {
    if (req.user) {
      req.user.refreshTokens = null;
      await req.user.save();
    }

    res.clearCookie("accessToken");
    res.clearCookie("refreshToken");

    res.status(200).json({ message: "Logged out successfully" });
  } catch (error) {
    console.error("Logout error:", error);
    res.status(500).json({ message: "Logout failed" });
  }
}));

export default router;
