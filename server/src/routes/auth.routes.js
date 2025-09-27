import { Router } from "express";
import passport from "passport";
import { User } from "../models/User.models.js";
import { ApiError } from "../utils/ApiError.js";
import { asyncHandler } from "../utils/asyncHandler.js";

const router = Router();

// Helper to generate tokens
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
    if (!req.user) {
      return res.redirect("https://testimonia-delta.vercel.app/login?error=true");
    }

    // Generate access and refresh tokens
    const { accessToken, refreshTokens } = await GenerateAccessandRefreshToken(req.user);

    // ✅ Secure cookie settings for cross-domain
    const cookieOptions = {
      httpOnly: true,
      secure: true,       // Required on HTTPS
      sameSite: "none",   // Required for cross-site OAuth
      maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
    };

    // Set cookies
    res.cookie("accessToken", accessToken, cookieOptions);
    res.cookie("refreshTokens", refreshTokens, cookieOptions);

    // Redirect to frontend dashboard
    return res.redirect("https://testimonia-delta.vercel.app/space");
  })
);

// Logout Route
router.get("/logout", asyncHandler(async (req, res) => {
  if (req.user) {
    req.user.refreshTokens = null;
    await req.user.save();
  }

  res.clearCookie("accessToken");
  res.clearCookie("refreshToken");

  return res.status(200).json({ message: "Logged out successfully" });
}));

export default router;
