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
  passport.authenticate("google", { session: true, failureRedirect: "/failure" }),
  async (req, res) => {
    try {
      if (!req.user) return res.redirect("https://testimonia-delta.vercel.app/login");

      // Generate tokens
      const accessToken = req.user.GenerateAccessTokens();
      const refreshToken = req.user.GenerateRefreshTokens();

      // Save refresh token in DB
      req.user.refreshTokens = refreshToken;
      await req.user.save();

      // Set cookies (cross-domain safe)
      res.cookie("accessToken", accessToken, {
        httpOnly: true,
        secure: true,
        sameSite: "none",
        maxAge: 1000 * 60 * 60 * 24, // 1 day
      });

      res.cookie("refreshTokens", refreshToken, {
        httpOnly: true,
        secure: true,
        sameSite: "none",
        maxAge: 1000 * 60 * 60 * 24,
      });

      // Redirect to frontend space page
      res.redirect("https://testimonia-delta.vercel.app/space");
    } catch (err) {
      console.error("Google login error:", err);
      res.redirect("https://testimonia-delta.vercel.app/login");
    }
  }
);

// 3️⃣ Failure route
router.get("/failure", (req, res) => {
  res.status(401).json({ success: false, message: "OAuth failed" });
});

// 4️⃣ Logout
router.get("/logout", async (req, res) => {
  try {
    if (req.user) {
      req.user.refreshTokens = null;
      await req.user.save();
    }

    res.clearCookie("accessToken", { httpOnly: true, secure: true, sameSite: "none" });
    res.clearCookie("refreshTokens", { httpOnly: true, secure: true, sameSite: "none" });

    res.status(200).json({ success: true, message: "Logged out successfully" });
  } catch (err) {
    console.error("Logout error:", err);
    res.status(500).json({ success: false, message: "Logout failed" });
  }
});

export default router;
