import { Router } from "express";
import passport from "passport";

const router = Router();
const FRONTEND_URL = process.env.CORS_ORIGIN || "https://testimonia-delta.vercel.app";
console.log(FRONTEND_URL)

// 1️⃣ Start Google OAuth
router.get(
  "/google",
  passport.authenticate("google", { scope: ["profile", "email"] })
);

// 2️⃣ Google OAuth callback
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

      const options = {
       httpOnly: true,
       secure: true,
       sameSite: "None",
       path: "/", // ⬅️ important!
    //    maxAge: 7 * 24 * 60 * 60 * 1000,
   }

      // ⚠ Set tokens as secure, cross-domain cookies
      res.cookie("accessToken", accessToken, options);

      res.cookie("refreshTokens", refreshTokens, options );

      // Redirect to frontend WITHOUT tokens in query params
      return res.redirect(`${FRONTEND_URL}/space`);
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
    const { refreshTokens } = req.cookies;

    if (refreshTokens && req.user) {
      req.user.refreshTokens = null;
      await req.user.save();
    }

    // Clear cookies on logout
    res.clearCookie("accessToken");
    res.clearCookie("refreshTokens");

    return res.status(200).json({ success: true, message: "Logged out successfully" });
  } catch (err) {
    console.error("Logout error:", err);
    return res.status(500).json({ success: false, message: "Logout failed" });
  }
});

export default router;
