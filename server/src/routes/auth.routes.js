// routes/auth.routes.js
import { Router } from "express";
import passport from "passport";

const router = Router();
// CORS_ORIGIN=https://testimonia-delta.vercel.app
const FRONTEND_URL = "http://localhost:5173"

// Step 1: Start Google Login
router.get(
  "/google",
  passport.authenticate("google", { scope: ["profile", "email"] })
);

// Step 2: Google Callback
router.get(
  "/google/callback",
  passport.authenticate("google", {
    failureRedirect: `${FRONTEND_URL}/login`,
    session: false,
  }),
  async (req, res) => {
    try {
      const accessToken = req.user.GenerateAccessTokens();
      const refreshTokens = req.user.GenerateRefreshTokens();

      // Save refresh token in DB
      req.user.refreshTokens = refreshTokens;
      await req.user.save();

      // Send as cookies
      res.cookie("accessToken", accessToken, {
        httpOnly: true,
        secure: false, // set true in production (HTTPS)
        sameSite: "lax",
      });

      res.cookie("refreshTokens", refreshTokens, {
        httpOnly: true,
        secure: false,
        sameSite: "lax",
      });

      res.redirect(`${FRONTEND_URL}/space`);
    } catch (error) {
      console.error("Google login error:", error);
      res.redirect("http://localhost:5173/login?error=true");
    }
  }
);

// Step 3: Google Logout
router.get("/logout", async (req, res) => {
  try {
    if (req.user) {
      req.user.refreshTokens = null; // clear stored refresh token
      await req.user.save();
    }

    // Clear cookies
    res.clearCookie("accessToken");
    res.clearCookie("refreshTokens");

    res.status(200).json({ message: "Logged out successfully" });
  } catch (error) {
    console.error("Logout error:", error);
    res.status(500).json({ message: "Logout failed" });
  }
});

export default router;
