import passport from "passport";
import { Strategy as GoogleStrategy } from "passport-google-oauth20";
import { User } from "../models/User.models.js";
import { uploadOnCloudinary } from "../utils/cloudinary.js"; // updated function
import fetch from "node-fetch"; // make sure node-fetch is installed

// Upload Google avatar directly from buffer
const downloadAndUploadGoogleAvatar = async (url) => {
  try {
    const response = await fetch(url);
    const arrayBuffer = await response.arrayBuffer();
    const buffer = Buffer.from(arrayBuffer);

    // Upload buffer directly to Cloudinary
    const uploadResult = await uploadOnCloudinary(buffer, `google-avatar-${Date.now()}`);
    return uploadResult?.secure_url || null;
  } catch (err) {
    console.error("Error downloading/uploading Google avatar:", err);
    return null;
  }
};

passport.use(
  new GoogleStrategy(
    {
      clientID: process.env.GOOGLE_CLIENT_ID,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET,
      callbackURL: "https://testimonialapp.onrender.com/api/v1/auth/google/callback",
    },
    async (accessToken, refreshToken, profile, done) => {
      try {
        let user = await User.findOne({ googleId: profile.id });
        let cloudinaryAvatar = null;

        if (profile.photos[0]?.value) {
          cloudinaryAvatar = await downloadAndUploadGoogleAvatar(profile.photos[0].value);
        }

        if (!user) {
          user = await User.create({
            googleId: profile.id,
            Username: profile.displayName,
            email: profile.emails[0].value,
            avatar: cloudinaryAvatar,
          });
        } else if (profile.photos[0]?.value && (!user.avatar || user.avatar !== cloudinaryAvatar)) {
          user.avatar = cloudinaryAvatar;
          await user.save();
        }

        return done(null, user);
      } catch (err) {
        console.error("Google OAuth Error:", err);
        return done(err, null);
      }
    }
  )
);

passport.serializeUser((user, done) => done(null, user.id));

passport.deserializeUser(async (id, done) => {
  try {
    const user = await User.findById(id);
    done(null, user);
  } catch (err) {
    done(err, null);
  }
});

export default passport;
