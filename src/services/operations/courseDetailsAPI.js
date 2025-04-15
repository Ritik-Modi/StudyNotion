import { toast } from "react-hot-toast";
import { apiConnector } from "../apiConnector";
import { courseEndpoints } from "../apis";

const {
  COURSE_DETAILS_API,
  COURSE_CATEGORIES_API,
  GET_ALL_COURSE_API,
  CREATE_COURSE_API,
  EDIT_COURSE_API,
  CREATE_SECTION_API,
  CREATE_SUBSECTION_API,
  UPDATE_SECTION_API,
  UPDATE_SUBSECTION_API,
  DELETE_SECTION_API,
  DELETE_SUBSECTION_API,
  GET_ALL_INSTRUCTOR_COURSES_API,
  DELETE_COURSE_API,
  GET_FULL_COURSE_DETAILS_AUTHENTICATED,
  CREATE_RATING_API,
  LECTURE_COMPLETION_API,
} = courseEndpoints;

const apiCall = async (method, url, data = null, options = {}) => {
  const toastId = toast.loading("Processing...");
  try {
    const response = await apiConnector(method, url, data, {
      "Content-Type": options.isFormData
        ? "multipart/form-data"
        : "application/json",
    });

    if (!response.success) {
      throw new Error(response.message || "Request failed");
    }

    toast.success(response.message || "Success!");
    return response.data || true;
  } catch (error) {
    console.error(`API ERROR (${url}):`, error);
    toast.error(error.message || "Something went wrong");
    return null;
  } finally {
    toast.dismiss(toastId);
  }
};

// ✅ API FUNCTIONS

export const getAllCourses = () => apiCall("GET", GET_ALL_COURSE_API);

export const fetchCourseDetails = (courseId) =>
  apiCall("GET", `${COURSE_DETAILS_API}/${courseId}`);

export const fetchCourseCategories = () =>
  apiCall("GET", COURSE_CATEGORIES_API);

export const addCourseDetails = (data) =>
  apiCall("POST", CREATE_COURSE_API, data, {
    isFormData: data instanceof FormData,
  });

export const editCourseDetails = (data) =>
  apiCall("PUT", EDIT_COURSE_API, data, {
    isFormData: data instanceof FormData,
  });

export const createSection = (data) =>
  apiCall("POST", CREATE_SECTION_API, data);

export const createSubSection = (data) =>
  apiCall("POST", CREATE_SUBSECTION_API, data, {
    isFormData: data instanceof FormData,
  });

export const updateSection = (data) => apiCall("PUT", UPDATE_SECTION_API, data);

export const updateSubSection = (data) =>
  apiCall("PUT", UPDATE_SUBSECTION_API, data, {
    isFormData: data instanceof FormData,
  });

export const deleteSection = (sectionId) =>
  apiCall("DELETE", `${DELETE_SECTION_API}/${sectionId}`);

export const deleteSubSection = (subSectionId) =>
  apiCall("DELETE", `${DELETE_SUBSECTION_API}/${subSectionId}`);

export const fetchInstructorCourses = () =>
  apiCall("GET", GET_ALL_INSTRUCTOR_COURSES_API);

export const deleteCourse = (courseId) =>
  apiCall("DELETE", `${DELETE_COURSE_API}/${courseId}`);

export const getFullDetailsOfCourse = (courseId) =>
  apiCall("GET", `${GET_FULL_COURSE_DETAILS_AUTHENTICATED}/${courseId}`);

export const markLectureAsComplete = (data) =>
  apiCall("POST", LECTURE_COMPLETION_API, data);

export const createRating = (data) => apiCall("POST", CREATE_RATING_API, data);
