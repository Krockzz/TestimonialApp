import { Router } from "express";
import passport from "passport";

const router = Router();
const FRONTEND_URL = process.env.CORS_ORIGIN || "https://testimonia-delta.vercel.app";

// 1️⃣ Start Google OAuth
router.get(
  "/google",
  passport.authenticate("google", { scope: ["profile", "email"] })
);

// 2️⃣ Google OAuth callback with JS redirect to ensure cookies are set
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

      // Cookie options
      const cookieOptions = {
        httpOnly: true,
        secure: true,
        sameSite: "None",
        path: "/",
        domain: "testimonialapp.onrender.com",
        maxAge: 15 * 60 * 1000, // 15 min for accessToken
      };

      const refreshCookieOptions = {
        httpOnly: true,
        secure: true,
        sameSite: "None",
        path: "/",
        domain: "testimonialapp.onrender.com",
        maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
      };

      // Send cookies and then redirect using JS to frontend
      return res
        .cookie("accessToken", accessToken, cookieOptions)
        .cookie("refreshTokens", refreshTokens, refreshCookieOptions)
        .status(200)
        .send(`
          <html>
            <body>
              <script>
                window.location.href = "${FRONTEND_URL}/space";
              </script>
            </body>
          </html>
        `);
    } catch (err) {
      console.log("OAuth callback error:", err);
      return res.redirect(`${FRONTEND_URL}/space`);
    }
  }
);

// 3️⃣ Failure route
router.get("/failure", (req, res) => {
  return res.redirect(`${FRONTEND_URL}/space`);
});

// 4️⃣ Logout
router.get("/logout", async (req, res) => {
  try {
    if (req.user) {
      req.user.refreshTokens = null;
      await req.user.save();
    }

    // Clear cookies on logout (ensure path is '/')
    res.clearCookie("accessToken", { path: "/" });
    res.clearCookie("refreshTokens", { path: "/" });

    return res.status(200).json({ success: true, message: "Logged out successfully" });
  } catch (err) {
    console.error("Logout error:", err);
    return res.status(500).json({ success: false, message: "Logout failed" });
  }
});

export default router;
