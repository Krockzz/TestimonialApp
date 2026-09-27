import { Router } from "express";
import passport from "passport";
import jwt from "jsonwebtoken";

const router = Router();

const FRONTEND_URL =
  process.env.FRONTEND_URL || "http://localhost:5173";

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

      // Short-lived token used only to hand authentication
      // from Render to the Remix/Vercel server.
      const authCode = jwt.sign(
        {
          accessToken,
          refreshTokens,
        },
        process.env.GOOGLE_HANDOFF_SECRET,
        {
          expiresIn: "60s",
        }
      );

      res.redirect(
        `${FRONTEND_URL}/auth/google/callback?code=${encodeURIComponent(
          authCode
        )}`
      );
    } catch (error) {
      console.error("Google login error:", error);

      res.redirect(`${FRONTEND_URL}/login?error=true`);
    }
  }
);

router.get("/google/exchange", async (req, res) => {
  try {
    const { code } = req.query;

    if (!code) {
      return res.status(400).json({
        message: "Missing authentication code",
      });
    }

    const decoded = jwt.verify(
      code,
      process.env.GOOGLE_HANDOFF_SECRET
    );

    res.status(200).json({
      accessToken: decoded.accessToken,
      refreshTokens: decoded.refreshTokens,
    });
  } catch (error) {
    console.error("Google exchange error:", error);

    return res.status(401).json({
      message: "Invalid or expired authentication code",
    });
  }
});

// Google Logout
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
    console.error("Logout error:", error);

    res.status(500).json({
      message: "Logout failed",
    });
  }
});

export default router;