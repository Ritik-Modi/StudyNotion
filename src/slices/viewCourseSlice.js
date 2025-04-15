import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  // Define your initial state here
  courseSectionData: [],
  courseEntireData: [],
  completedLecture: [],
  totalNoOfCourse: 0,
};

const viewCourseSlice = createSlice({
  name: "viewCourse",
  initialState,
  reducers: {
    setCourseSectionData: (state, action) => {
      state.courseSectionData = action.payload;
    },
    setCourseEntireData: (state, action) => {
      state.courseEntireData = action.payload;
    },
    setTotalNoOfCourse: (state, action) => {
      state.totalNoOfCourse = action.payload;
    },
    setCompletedLecture: (state, action) => {
      state.completedLecture = action.payload;
    },
    updateCompletedLecture: (state, action) => {
      state.completedLecture = [...state.completedLecture, action.payload];
    },
  },
});

export const {
  setCompletedLecture,
  setCourseEntireData,
  setCourseSectionData,
  setTotalNoOfCourse,
  updateCompletedLecture,
} = viewCourseSlice.actions;
export default viewCourseSlice.reducer;
