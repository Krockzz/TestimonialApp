import passport from "passport";
import { Strategy as GoogleStrategy } from "passport-google-oauth20";
import { User } from "../models/User.models.js";
import { uploadOnCloudinary } from "../utils/cloudinary.js";
import fs from "fs";
import path from "path";

const downloadAndUploadGoogleAvatar = async (url) => {
  try {
    const tempPath = path.join("./public/temp", `${Date.now()}-avatar.jpg`);
    
    // Fetch image from Google
    const response = await fetch(url);
    const arrayBuffer = await response.arrayBuffer();
    const buffer = Buffer.from(arrayBuffer);

    // Save temporarily
    fs.writeFileSync(tempPath, buffer);

    // Upload using your Cloudinary utility
    const uploadResult = await uploadOnCloudinary(tempPath);
    return uploadResult?.url || null;
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
