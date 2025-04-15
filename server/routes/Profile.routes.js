import express from "express";
const router = express.Router();
import { auth, isInstructor } from "../middlewares/auth.middleware.js";
import {
  deleteProfile,
  updateProfile,
  updateProfilePicture,
  getEnrolledCourses,
  instructorDashBoard,
  getAllUserDetails,
} from "../controllers/Profile.controller.js";

// ********************************************************************************************************
//                                      Profile routes
// ********************************************************************************************************
// Delete User Account
router.delete("/deleteProfile", auth, deleteProfile);
router.put("/updateProfile", auth, updateProfile);
router.get("/getEnrolledCourses", auth, getEnrolledCourses);
router.put("/updateDisplayPicture", auth, updateProfilePicture);
router.get("/instructorDashboard", auth, isInstructor, instructorDashBoard);
router.get("/getUserDetails", auth, getAllUserDetails);

export default router;
