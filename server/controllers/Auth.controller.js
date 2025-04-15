import User from "../models/User.model.js";
import Otp from "../models/Otp.model.js";
import Profile from "../models/Profile.model.js";
import otpGenerator from "otp-generator";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import dotenv from "dotenv";
import mailSender from "../utils/mailSender.utils.js";
import { otpTemplate } from "../mail/templates/emailVerificationTemplate.js";
import mongoose from "mongoose";
dotenv.config();

const generateUniqueOtp = async () => {
  let otp, isDuplicate;
  let retries = 5; // Maximum retries to prevent infinite loop

  do {
    otp = otpGenerator.generate(6, {
      upperCaseAlphabets: false,
      lowerCaseAlphabets: false,
      specialChars: false,
    });
    isDuplicate = await Otp.exists({ otp }); // `exists` is more efficient than `findOne`
    retries--;
  } while (isDuplicate && retries > 0);

  if (retries === 0) {
    throw new Error("Failed to generate a unique OTP.");
  }

  return otp;
};

const sendOtp = async (req, res) => {
  try {
    const { email } = req.body;

    // Check if user already exists
    if (await User.exists({ email })) {
      return res
        .status(400)
        .json({ success: false, message: "User already exists" });
    }

    // Generate a unique OTP
    const otp = await generateUniqueOtp();
    console.log("Generated OTP:", otp);

    // Store OTP in database
    const otpEntry = await Otp.create({ email, otp });
    console.log("OTP Entry:", otpEntry);

    return res.status(200).json({
      success: true,
      message: "OTP sent successfully",
    });
  } catch (error) {
    console.error("Error in sendOtp:", error);
    return res
      .status(500)
      .json({ success: false, message: "Internal Server Error" });
  }
};
// sign up

const signUP = async (req, res) => {
  try {
    // Destructure and sanitize input
    const {
      firstName,
      lastName,
      email,
      password,
      confirmPassword,
      accountType,
      contactNumber,
      otp,
    } = req.body;

    // Validate required fields
    if (
      !firstName?.trim() ||
      !lastName?.trim() ||
      !email?.trim() ||
      !password ||
      !confirmPassword ||
      !otp
    ) {
      return res.status(400).json({
        success: false,
        message: "All fields are required!",
      });
    }

    // Validate email format (optional but recommended)
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email.trim())) {
      return res.status(400).json({
        success: false,
        message: "Invalid email format!",
      });
    }

    // Validate password match
    if (password !== confirmPassword) {
      return res.status(400).json({
        success: false,
        message: "Password and confirm password should be the same!",
      });
    }

    // Check if the user already exists
    const userExist = await User.findOne({ email: email.trim() });
    if (userExist) {
      return res.status(400).json({
        success: false,
        message: "User already exists with this email!",
      });
    }
    const recentOtp = await Otp.findOne({ email: email.trim() }).sort({
      createdAt: -1,
    });

    if (!recentOtp) {
      // Fix incorrect check
      return res.status(400).json({
        success: false,
        message: "OTP not found. Please request a new one!",
      });
    }

    if (otp !== recentOtp.otp) {
      return res.status(400).json({
        success: false,
        message: "Invalid OTP! Please check and try again.",
      });
    }
    // // Fetch most recent OTP for this email
    // const recentOtp = await Otp.findOne({ email: email.trim() }).sort({
    //   createdAt: -1,
    // });

    // if (recentOtp.length === 0) {
    //   return res.status(400).json({
    //     success: false,
    //     message: "OTP not found. Please request a new one!",
    //   });
    // }

    // // Extract OTP and check expiration (assuming OTP expires in 5 minutes)
    // const storedOtp = recentOtp[0].otp;
    // const otpExpirationTime = 5 * 60 * 1000; // 5 minutes
    // if (Date.now() - recentOtp[0].createdAt > otpExpirationTime) {
    //   return res.status(400).json({
    //     success: false,
    //     message: "OTP has expired! Please request a new one.",
    //   });
    // }

    // // Validate OTP
    // if (otp !== storedOtp) {
    //   return res.status(400).json({
    //     success: false,
    //     message: "Invalid OTP! Please check and try again.",
    //   });
    // }

    // Hash the password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Create user profile
    const profileDetails = await Profile.create({
      gender: null,
      dateOfBirth: null,
      about: null,
      contactNumber: contactNumber?.trim() || null,
    });

    // Create user entry in the database
    const user = await User.create({
      firstName: firstName.trim(),
      lastName: lastName.trim(),
      email: email.trim(),
      password: hashedPassword,
      accountType,
      contactNumber: contactNumber?.trim() || null,
      additionalDetails: profileDetails._id,
      image: `https://api.dicebear.com/9.x/initials/svg?seed=${encodeURIComponent(
        firstName.trim() + " " + lastName.trim()
      )}`,
    });

    // Return success response
    return res.status(201).json({
      success: true,
      message: "User registered successfully!",
      user,
    });
  } catch (error) {
    console.error("Error in sign-up:", error.message);
    return res.status(500).json({
      success: false,
      message: "User could not be registered. Please try again later.",
    });
  }
};

// login
const login = async (req, res) => {
  try {
    const { email, password } = req.body;

    // Validate data
    if (!email || !password) {
      return res.status(400).json({
        success: false,
        message: "All fields are required! Try again.",
      });
    }

    // Check if the user exists
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(401).json({
        success: false,
        message: "User not found! Please sign up.",
      });
    }

    // Validate password
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(401).json({
        success: false,
        message: "Invalid password! Try again.",
      });
    }

    // Create JWT payload
    const payload = {
      id: user._id,
      email: user.email,
      accountType: user.accountType,
    };

    // Generate JWT Token
    const token = jwt.sign(payload, process.env.JWT_SECRET, {
      expiresIn: "24h",
    });

    console.log("✅ Generated JWT Token:", token);

    // Set token in HTTP-only cookie
    res.cookie("token", token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production", // Secure cookie in production
      sameSite: "strict",
      maxAge: 3 * 24 * 60 * 60 * 1000, // 3 days expiration
    });

    res.setHeader("Authorization", `Bearer ${token}`);

    // Remove password before sending user details
    user.password = undefined;

    return res.status(200).json({
      success: true,
      message: "User logged in successfully",
      user,
      token,
    });
  } catch (error) {
    console.error("❌ Login Error:", error.message);
    return res.status(500).json({
      success: false,
      message: "User cannot be logged in. Try again!",
    });
  }
};

// change password TODO: make the change password
const changePassword = async (req, res) => {
  try {
    //get data from req body
    const { oldPassword, newPassword, confirmPassword } = req.body;

    // check if the new password and confirm password are the same
    if (newPassword !== confirmPassword) {
      return res.status(400).json({
        success: false,
        message: "New password and confirm password should be same!",
      });
    }

    // check if the new password is valid
    if (newPassword.length < 8) {
      return res.status(400).json({
        success: false,
        message: "Password should be at least 8 characters long!",
      });
    }

    //get the user current password from db and check if it match the old password
    const user = await User.findById(req.user.id);
    if (!user) {
      return res.status(401).json({
        success: false,
        message: "User not found!",
      });
    }

    const isMatch = await bcrypt.compare(oldPassword, user.password);
    if (!isMatch) {
      return res.status(401).json({
        success: false,
        message: "Invalid old password!",
      });
    }

    // hash the new password
    const hashedPassword = await bcrypt.hash(newPassword, 10);
    user.password = hashedPassword;
    await user.save();

    // send the mail notification about the password change
    const email = user.email;
    const title = "Password changed successfully";
    const body = "<p> your password has been changed successfully";

    const emailResult = await mailSender(email, title, body);
    if (!emailResult) {
      return res.status(500).json({
        success: false,
        message: "Failed to send email notification about password change",
      });
    }

    return res.status(200).json({
      success: true,
      message: "Password changed successfully",
    });
  } catch (error) {
    console.log(error.message);
    return res.status(500).json({
      success: false,
      message: "Failed to change password, try again !!",
    });
  }
};

export { sendOtp, signUP, login, changePassword };
