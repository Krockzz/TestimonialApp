import { Router } from "express";
import passport from "passport";

const router = Router();
const FRONTEND_URL = process.env.CORS_ORIGIN || "https://testimonia-delta.vercel.app";

// 1️⃣ Start Google OAuth
router.get(
  "/google",
  passport.authenticate("google", { scope: ["profile", "email"] })
);

// 2️⃣ Google OAuth callback → send tokens via URL to frontend
router.get(
  "/google/callback",
  passport.authenticate("google", {
    session: false,
    failureRedirect: "/api/auth/failure",
  }),
  async (req, res) => {
    try {
      if (!req.user) {
        return res.redirect(`${FRONTEND_URL}/login`);
      }

      // Generate JWT tokens
      const accessToken = req.user.GenerateAccessTokens();
      const refreshTokens = req.user.GenerateRefreshTokens();

      // Save refresh token in DB
      req.user.refreshTokens = refreshTokens;
      await req.user.save();

      // Redirect frontend with tokens in URL (temporary)
      const redirectUrl = `${FRONTEND_URL}/space?accessToken=${accessToken}&refreshToken=${refreshTokens}`;
      return res.redirect(redirectUrl);
    } catch (err) {
      console.error("OAuth callback error:", err);
      return res.redirect(`${FRONTEND_URL}/login`);
    }
  }
);

// 3️⃣ Failure route
router.get("/failure", (req, res) => {
  return res.redirect(`${FRONTEND_URL}/login`);
});

// 4️⃣ Logout
router.get("/logout", async (req, res) => {
  try {
    if (req.user) {
      req.user.refreshTokens = null;
      await req.user.save();
    }

    return res.status(200).json({ success: true, message: "Logged out successfully" });
  } catch (err) {
    console.error("Logout error:", err);
    return res.status(500).json({ success: false, message: "Logout failed" });
  }
});

export default router;
