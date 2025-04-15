import express from "express";
import dotenv from "dotenv";
import fileUpload from "express-fileupload";
import cookieParser from "cookie-parser";
import cors from "cors";

import dataBase from "./config/database.config.js";
import cloudinaryConnect from "./config/cloudinary.config.js";

import UserRouter from "./routes/User.routes.js";
import ProfileRouter from "./routes/Profile.routes.js";
import ContactRouter from "./routes/Contact.routes.js";
import PaymentRouter from "./routes/Payment.routes.js";
import CourseRouter from "./routes/Course.routes.js";

dotenv.config();

const app = express();
const PORT = process.env.PORT || 4000;

// Connect to database
dataBase();

// Middleware
app.use(express.json());
app.use(cookieParser());
app.use(
  cors({
    origin: ["http://localhost:5173", "http://127.0.0.1:5173"],
    credentials: true,
    methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
    // allowedHeaders: ["Content-Type", "Authorization"],
  })
);
// app.use((req, res, next) => {
//   res.header("Access-Control-Allow-Origin", "http://localhost:5173");
//   res.header("Access-Control-Allow-Credentials", "true");
//   res.header("Access-Control-Allow-Methods", "GET, POST, PUT, DELETE, OPTIONS");
//   res.header("Access-Control-Allow-Headers", "Content-Type, Authorization");
//   if (req.method === "OPTIONS") return res.sendStatus(200);
//   next();
// });

// ✅ Example Profile Picture Update API
app.put("/api/v1/profile/updateDisplayPicture", (req, res) => {
  if (!req.files || !req.files.displayPicture) {
    return res
      .status(400)
      .json({ success: false, message: "No file uploaded" });
  }
});
// Handle preflight requests explicitly
app.options("*", cors());
app.use(
  fileUpload({
    useTempFiles: true,
    tempFileDir: "/tmp/",
  })
);

cloudinaryConnect();

// Routes
app.use("/api/v1/auth", UserRouter);
app.use("/api/v1/profile", ProfileRouter);
app.use("/api/v1/course", CourseRouter);
app.use("/api/v1/payment", PaymentRouter);
app.use("/api/v1/reach", ContactRouter);

// Default route
app.get("/", (req, res) => {
  return res.json({
    success: true,
    message: "Welcome to the Study Notion API || Server is up and running!",
  });
});

// Start the server
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
