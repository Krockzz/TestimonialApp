import express from "express"
import cors from "cors"
import cookieParser from "cookie-parser"
import passport from "passport";
import session from "express-session"
import "./auth/passport.js"

// Creating an instance of express server
const app = express();

app.use(cors({
    origin: "https://testimonia-delta.vercel.app/",
    credentials: true,
}))

app.use(express.json({
    limit:"16kb"
}))

app.use(express.urlencoded({
    extended: true,
    limit: "16kb"
}))

app.use(
  session({
    secret: process.env.SESSION_SECRET || "supersecretkey",
    resave: false,
    saveUninitialized: false,
    cookie: {
      secure: true,       // HTTPS only
      httpOnly: true,     // Not accessible via JS
      sameSite: "none",   // Cross-domain cookies
      maxAge: 24 * 60 * 60 * 1000, // 1 day
    },
  })
);

app.use(passport.initialize());
app.use(passport.session());

app.use(cookieParser());
app.use(express.static("public"))

export  {app}

import router1 from "../src/routes/User.routes.js"
import router2 from "../src/routes/Space.routes.js"
import router3 from "../src/routes/Testimonial.routes.js"
import router4 from "../src/routes/comment.routes.js"
import router5 from "../src/routes/auth.routes.js"


app.use("/api/v1/users" , router1)
app.use("/api/v1/users/spaces" , router2)
app.use("/api/v1/users/Testimonial" , router3)
app.use("/api/v1/users/comments" , router4)
app.use("/api/v1/auth" , router5)