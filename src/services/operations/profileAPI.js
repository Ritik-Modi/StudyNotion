import { toast } from "react-hot-toast";
import { setUser, setLoading } from "../../slices/profileSlice";
import { logout } from "../operations/authAPI";
import { apiConnector } from "../apiConnector";
import { profileEndPoints } from "../apis";

const {
  GET_USER_DETAILS_API,
  GET_USER_ENROLLED_COURSES_API,
  GET_INSTRUCTOR_DATA_API,
} = profileEndPoints;

const apiCall = async (method, url, data = null) => {
  const toastId = toast.loading("Processing...");
  try {
    const response = await apiConnector(method, url, data);

    if (!response?.success) {
      throw new Error(response.message || "Request failed");
    }

    toast.dismiss(toastId);
    return response.data;
  } catch (error) {
    console.error(`API ERROR (${url}):`, error);
    toast.error(error?.message || "Something went wrong");
    return null;
  } finally {
    toast.dismiss(toastId);
  }
};

export function getUserDetails(navigate) {
  return async (dispatch) => {
    dispatch(setLoading(true));
    const userData = await apiCall("GET", GET_USER_DETAILS_API);

    if (!userData) {
      toast.error("Failed to fetch user details");
      return dispatch(logout(navigate));
    }

    const userImage = userData.image
      ? userData.image
      : `https://api.dicebear.com/5.x/initials/svg?seed=${userData.firstName} ${userData.lastName}`;

    dispatch(setUser({ ...userData, image: userImage }));
    dispatch(setLoading(false));
  };
}

export async function getInstructorData() {
  return (await apiCall("GET", GET_INSTRUCTOR_DATA_API)) || [];
}

export async function getUserEnrolledCourses() {
  return (await apiCall("GET", GET_USER_ENROLLED_COURSES_API)) || [];
}
