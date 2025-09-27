
import { Router } from "express";
import passport from "passport";

const router = Router();


router.get(
  "/google",
  passport.authenticate("google", { scope: ["profile", "email"] })
);


router.get(
  "/google/callback",
  passport.authenticate("google", {
    failureRedirect: "https://testimonia-delta.vercel.app/login",
    session: false, // keep false since we use JWT
  }),
  async (req, res) => {
    try {
      
      const accessToken = req.user.GenerateAccessTokens();
      const refreshToken = req.user.GenerateRefreshTokens();

     
      req.user.refreshTokens = refreshToken;
      await req.user.save();

   
      const cookieOptions = {
        httpOnly: true,
        secure: true,      // HTTPS only
        sameSite: "none",  // cross-domain
      };

      res.cookie("accessToken", accessToken, { ...cookieOptions, maxAge: 24 * 60 * 60 * 1000 });       // 1 day
      res.cookie("refreshToken", refreshToken, { ...cookieOptions, maxAge: 7 * 24 * 60 * 60 * 1000 }); // 7 days

      // Redirect to frontend dashboard
      res.redirect("https://testimonia-delta.vercel.app/space");
    } catch (error) {
      console.error("Google login error:", error);
      res.redirect("https://testimonia-delta.vercel.app/login?error=true");
    }
  }
);

// Logout Route
router.get("/logout", async (req, res) => {
  try {
    if (req.user) {
      req.user.refreshTokens = null; // clear refresh token
      await req.user.save();
    }

    res.clearCookie("accessToken");
    res.clearCookie("refreshToken");

    res.status(200).json({ message: "Logged out successfully" });
  } catch (error) {
    console.error("Logout error:", error);
    res.status(500).json({ message: "Logout failed" });
  }
});

export default router;
