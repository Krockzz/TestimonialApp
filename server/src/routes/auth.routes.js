import { Router } from "express";
import passport from "passport";
import { asyncHandler } from "../utils/asyncHandler.js";

const router = Router();

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

    // Tokens are already generated in passport.js and attached to user
    const accessToken = req.user.accessToken;
    const refreshTokens = req.user.refreshToken;

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
  res.clearCookie("refreshTokens");

  return res.status(200).json({ message: "Logged out successfully" });
}));

export default router;
