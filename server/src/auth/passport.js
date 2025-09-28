import passport from "passport";
import { Strategy as GoogleStrategy } from "passport-google-oauth20";
import { User } from "../models/User.models.js";
import { uploadOnCloudinary } from "../utils/cloudinary.js";
import fetch from "node-fetch";

// Utility to download Google avatar and upload to Cloudinary
const downloadAndUploadGoogleAvatar = async (url) => {
  try {
    console.log(`So the url is: ${url}`)
    const response = await fetch(url);
    console.log(response)
    const arrayBuffer = await response.arrayBuffer();
    const buffer = Buffer.from(arrayBuffer);

    const uploadResult = await uploadOnCloudinary(buffer, `google-avatar-${Date.now()}`);
    console.log(uploadResult.secure_url)
    return uploadResult?.secure_url || null;
  } catch (err) {
    console.log("Error downloading/uploading Google avatar:", err);
    return null;
  }
};




passport.use(
  new GoogleStrategy(
    {
      clientID: process.env.GOOGLE_CLIENT_ID,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET,
      callbackURL: "http://localhost:8000/api/v1/auth/google/callback",
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
        console.log("Google OAuth Error:", err);
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
