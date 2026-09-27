import { Router } from "express";
import passport from "passport";

const router = Router();

const FRONTEND_URL =
  process.env.FRONTEND_URL || "http://localhost:5173";

const isProduction = process.env.NODE_ENV === "production";

// Step 1: Start Google Login
router.get(
  "/google",
  passport.authenticate("google", {
    scope: ["profile", "email"],
  })
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

      req.user.refreshTokens = refreshTokens;
      await req.user.save();

      res.cookie("accessToken", accessToken, {
        httpOnly: true,
        secure: isProduction,
        sameSite: isProduction ? "none" : "lax",
      });

      res.cookie("refreshTokens", refreshTokens, {
        httpOnly: true,
        secure: isProduction,
        sameSite: isProduction ? "none" : "lax",
      });

      res.redirect(`${FRONTEND_URL}/space`);

    } catch (error) {
      console.log("Google login error:", error);

      res.redirect(`${FRONTEND_URL}/login?error=true`);
    }
  }
);

// Step 3: Google Logout
router.get("/logout", async (req, res) => {
  try {
    if (req.user) {
      req.user.refreshTokens = null;
      await req.user.save();
    }

    res.clearCookie("accessToken");
    res.clearCookie("refreshTokens");

    res.status(200).json({
      message: "Logged out successfully",
    });

  } catch (error) {
    console.log("Logout error:", error);

    res.status(500).json({
      message: "Logout failed",
    });
  }
});

export default router;