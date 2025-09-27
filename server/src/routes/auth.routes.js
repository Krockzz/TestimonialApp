import { Router } from "express";
import passport from "passport";

const router = Router();

// 1️⃣ Start Google OAuth
router.get(
  "/google",
  passport.authenticate("google", { scope: ["profile", "email"] })
);

// 2️⃣ OAuth callback
router.get(
  "/google/callback",
  passport.authenticate("google", { session: false, failureRedirect: "/failure" }),
  async (req, res) => {
    try {
      if (!req.user) {
        return res.redirect("https://testimonia-delta.vercel.app/login");
      }

      // Generate tokens
      const accessToken = req.user.GenerateAccessTokens();
      const refreshToken = req.user.GenerateRefreshTokens();

      // Save refresh token in DB
      req.user.refreshTokens = refreshToken;
      await req.user.save();

      // Redirect frontend with tokens in URL
      const redirectUrl = `https://testimonia-delta.vercel.app/space?accessToken=${accessToken}&refreshTokens=${refreshToken}`;
      res.redirect(redirectUrl);

    } catch (err) {
      console.error("OAuth callback error:", err);
      res.redirect("https://testimonia-delta.vercel.app/login");
    }
  }
);

// 3️⃣ Failure route
router.get("/failure", (req, res) => {
  res.redirect("https://testimonia-delta.vercel.app/login");
});

// 4️⃣ Logout (optional)
router.get("/logout", async (req, res) => {
  try {
    if (req.user) {
      req.user.refreshTokens = null;
      await req.user.save();
    }
    res.status(200).json({ success: true, message: "Logged out successfully" });
  } catch (err) {
    console.error("Logout error:", err);
    res.status(500).json({ success: false, message: "Logout failed" });
  }
});

export default router;
