import { combineReducers } from "@reduxjs/toolkit";

import cartReducer from "../slices/cartSlice.js";
import authReducer from "../slices/authSlice";
import profileReducer from "../slices/profileSlice";
import courseReducer from "../slices/courseSlice.js";
import viewCourseReducer from "../slices/viewCourseSlice.js";
const rootReducer = combineReducers({
  cart: cartReducer,
  auth: authReducer,
  profile: profileReducer,
  course: courseReducer,
  viewCourse: viewCourseReducer,
});

export default rootReducer;
