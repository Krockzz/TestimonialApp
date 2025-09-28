import { Router } from "express";
import passport from "passport";
import jwt from "jsonwebtoken";

const router = Router();
const FRONTEND_URL = process.env.CORS_ORIGIN || "https://testimonia-delta.vercel.app";

// Cookie options
const accessCookieOptions = {
  httpOnly: true,
  secure: false,
  sameSite: "none",
  maxAge: 24 * 60 * 60 * 1000, // 1 day
  path: "/",
};

const refreshCookieOptions = {
  httpOnly: true,
  secure: false,
  sameSite: "none",
  maxAge: 10 * 24 * 60 * 60 * 1000, // 10 days
  path: "/",
};

// 1️⃣ Start Google OAuth
router.get(
  "/google",
  passport.authenticate("google", { scope: ["profile", "email"] })
);

// 2️⃣ Google OAuth callback → set cookies and redirect frontend
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

      // 🔹 Generate JWT tokens directly
      const accessToken = jwt.sign(
        {
          _id: req.user._id,
          Username: req.user.Username,
          email: req.user.email,
        },
        process.env.ACCESS_TOKEN_SECRET,
        { expiresIn: "1d" } // 1 day
      );

      const refreshTokens = jwt.sign(
        {
          _id: req.user._id,
        },
        process.env.REFRESH_TOKEN_SECRET,
        { expiresIn: "10d" } // 10 days
      );

      console.log("Access Token:", accessToken);
      console.log("Refresh Token:", refreshTokens);

      // Save refresh token in DB
      req.user.refreshTokens = refreshTokens;
      await req.user.save();

      // 🔹 Set cookies directly from backend
      res.cookie("accessToken", accessToken, accessCookieOptions);
      res.cookie("refreshTokens", refreshTokens, refreshCookieOptions);

      // Redirect frontend to clean URL
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
    if (req.user) {
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
