// Import the required modules
import express from "express";
const router = express.Router();

// Import the Controllers

// Course Controllers Import
import {
  createCourse,
  showAllCourses,
  getCourseDetails,
  deleteCourse,
  getFullCourseDetails,
  getInstructorCourses,
  editCourse,
} from "../controllers/Course.controller.js";

// Categories Controllers Import
import {
  getAllCategories,
  createCategory,
  categoryPageDetails,
} from "../controllers/Category.controller.js";

// Sections Controllers Import
import {
  createSection,
  updateSection,
  deleteSection,
} from "../controllers/Section.controller.js";

// Sub-Sections Controllers Import
import {
  createSubSection,
  updateSubSection,
  deleteSubSection,
} from "../controllers/SubSection.controller.js";

// Rating Controllers Import
import {
  createRating,
  getAverageRating,
  getAllRating,
  getCourseRatings,
} from "../controllers/RatingAndReview.controller.js";

import { updateCourseProgress } from "../controllers/CourseProgress.controller.js";

// Importing Middlewares
import {
  auth,
  isInstructor,
  isStudent,
  isAdmin,
} from "../middlewares/auth.middleware.js";

// ********************************************************************************************************
//                                      Course routes
// ********************************************************************************************************

// Courses can Only be Created by Instructors
router.post("/createCourse", auth, isInstructor, createCourse);
//Add a Section to a Course
router.post("/addSection", auth, isInstructor, createSection);
// Update a Section
router.post("/updateSection", auth, isInstructor, updateSection);
// Delete a Section
router.post("/deleteSection", auth, isInstructor, deleteSection);
// Edit Sub Section
router.post("/updateSubSection", auth, isInstructor, updateSubSection);
// Delete Sub Section
router.post("/deleteSubSection", auth, isInstructor, deleteSubSection);
// Add a Sub Section to a Section
router.post("/addSubSection", auth, isInstructor, createSubSection);
// Get all Registered Courses
router.get("/showAllCourses", showAllCourses);
// Get Details for a Specific Courses
router.post("/getCourseDetails", getCourseDetails);
router.post("/updateCourseProgress", auth, isStudent, updateCourseProgress);

// Get Details for a Specific Courses
router.post("/getFullCourseDetails", auth, getFullCourseDetails);
// Edit Course routes
router.post("/editCourse", auth, isInstructor, editCourse);
// Get all Courses Under a Specific Instructor
router.get("/getInstructorCourses", auth, isInstructor, getInstructorCourses);
// Delete a Course
router.delete("/deleteCourse", deleteCourse);

//                                      Category routes (Only by Admin)
// Category can Only be Created by Admin
// TODO: Put IsAdmin Middleware here
router.post("/createCategory", auth, isAdmin, createCategory);
router.get("/showAllCategories", getAllCategories);
router.post("/getCategoryPageDetails", categoryPageDetails);

//                                      Rating and Review
router.post("/createRating", auth, isStudent, createRating);
router.get("/getAverageRating", getAverageRating);
router.get("/getReviews", getAllRating);

export default router;
