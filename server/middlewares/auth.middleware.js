import jwt from "jsonwebtoken";
import dotenv from "dotenv";

dotenv.config();

// Authentication Middleware
const auth = async (req, res, next) => {
  try {
    // Extract token from cookies
    const token = req.cookies.token;

    if (!token) {
      return res.status(401).json({
        success: false,
        message: "Token is missing. Please log in.",
      });
    }

    console.log("🔍 Extracted Token from Cookies:", token);

    // Verify Token
    try {
      const decoded = jwt.verify(token, process.env.JWT_SECRET);
      console.log("✅ Decoded Token:", decoded);

      req.user = decoded; // Store user details in request
      next();
    } catch (err) {
      console.error("❌ JWT Verification Error:", err.message);
      return res.status(401).json({
        success: false,
        message: "Token is invalid or expired. Please log in again.",
      });
    }
  } catch (error) {
    console.error("❌ Auth Middleware Error:", error.message);
    return res.status(500).json({
      success: false,
      message: "Something went wrong while validating the token",
    });
  }
};

// Role-Based Middleware
const isStudent = async (req, res, next) => {
  try {
    if (req.user.accountType !== "Student") {
      return res.status(403).json({
        success: false,
        message: "This route is protected for students only",
      });
    }
    next();
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Something went wrong while validating the student role",
    });
  }
};

const isInstructor = async (req, res, next) => {
  try {
    if (req.user.accountType !== "Instructor") {
      return res.status(403).json({
        success: false,
        message: "This route is protected for instructors only",
      });
    }
    next();
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Something went wrong while validating the instructor role",
    });
  }
};

const isAdmin = async (req, res, next) => {
  try {
    if (req.user.accountType !== "Admin") {
      return res.status(403).json({
        success: false,
        message: "This route is protected for admins only",
      });
    }
    next();
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Something went wrong while validating the admin role",
    });
  }
};

export { auth, isStudent, isInstructor, isAdmin };
