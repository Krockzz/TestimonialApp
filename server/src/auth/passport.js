import passport from "passport";
import { Strategy as GoogleStrategy } from "passport-google-oauth20";
import { User } from "../models/User.models.js";
import { uploadOnCloudinary } from "../utils/cloudinary.js";
import fetch from "node-fetch";
import fs from "fs";
import path from "path";
import os from "os"


const downloadAndUploadGoogleAvatar = async (url) => {
  try {
    if (!url) return null;
    const fileName = `google-avatar-${Date.now()}.jpg`;
    const filePath = path.join(os.tmpdir() , fileName); 

    const response = await fetch(url);
    if (!response.ok) throw new Error(`Failed to fetch image: ${response.statusText}`);

    const fileStream = fs.createWriteStream(filePath);
    await new Promise((resolve, reject) => {
      response.body.pipe(fileStream);
      response.body.on("error", reject);
      fileStream.on("finish", resolve);
    });

    const uploadResult = await uploadOnCloudinary(filePath);
    if (!uploadResult?.secure_url) throw new Error("Failed to upload avatar to Cloudinary");

    return uploadResult.secure_url;
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
