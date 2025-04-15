import { toast } from "react-hot-toast";
import { apiConnector } from "../apiConnector";
import { logout } from "./authAPI";
import { settingsEndpoints } from "../apis";
import { setUser } from "../../slices/profileSlice";

const {
  UPDATE_DISPLAY_PICTURE_API,
  UPDATE_PROFILE_API,
  UPDATE_PASSWORD_API, // Corrected from CHANGE_PASSWORD_API
  DELETE_PROFILE_API,
} = settingsEndpoints;

export function updateDisplayPicture(formData) {
  return async (dispatch) => {
    const toastId = toast.loading("Uploading...");

    try {
      const response = await apiConnector(
        "PUT",
        UPDATE_DISPLAY_PICTURE_API,
        formData
      );

      console.log("UPDATE_DISPLAY_PICTURE_API_RESPONSE:", response);

      if (!response.success) {
        throw new Error(response.message || "Failed to update profile picture");
      }

      dispatch(setUser(response.data)); // ✅ Update Redux store
      toast.success("Profile picture updated successfully");
    } catch (error) {
      console.error("UPDATE_DISPLAY_PICTURE_API_ERROR:", error);
      toast.error(error.message || "Could not update display picture");
    }

    toast.dismiss(toastId);
  };
}

export function updateProfile(token, formData) {
  return async (dispatch) => {
    const toastId = toast.loading("Loading...");
    try {
      const response = await apiConnector("PUT", UPDATE_PROFILE_API, formData, {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      });

      console.log("UPDATE_PROFILE_API_RESPONSE:", response);

      if (!response.success) {
        throw new Error(response.message || "Failed to update profile");
      }

      // const userImg = response.data.updatedUserDetails.image
      //   ? response.data.updatedUserDetails.image
      //   : `https://api.dicebear.com/9.x/initials/svg?seed=${response.data.updatedUserDetails.firstName} ${response.data.updatedUserDetails.lastName}`; // Updated to version 9.x

      dispatch(setUser({ ...response.data.updatedUserDetails }));

      toast.success("Profile updated successfully");
    } catch (error) {
      console.error("UPDATE_PROFILE_API_ERROR:", error);
      toast.error(error.message || "Could not update profile");
    }
    toast.dismiss(toastId);
  };
}

export async function changePassword(token, formData) {
  const toastId = toast.loading("Loading...");
  try {
    const response = await apiConnector("POST", UPDATE_PASSWORD_API, formData, {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    });

    console.log("CHANGE_PASSWORD_API_RESPONSE:", response);

    if (!response.success) {
      throw new Error(response.message || "Failed to change password");
    }

    toast.success("Password changed successfully");
    return true;
  } catch (error) {
    console.error("CHANGE_PASSWORD_API_ERROR:", error);
    toast.error(error.message || "Could not change password");
    return false;
  } finally {
    toast.dismiss(toastId);
  }
}

export function deleteProfile(token, navigate) {
  return async (dispatch) => {
    const toastId = toast.loading("Loading...");
    try {
      const response = await apiConnector("DELETE", DELETE_PROFILE_API, null, {
        Authorization: `Bearer ${token}`,
      });

      console.log("DELETE_PROFILE_API_RESPONSE:", response);

      if (!response.success) {
        throw new Error(response.message || "Failed to delete profile");
      }

      toast.success("Profile deleted successfully");
      dispatch(logout(navigate));
    } catch (error) {
      console.error("DELETE_PROFILE_API_ERROR:", error);
      toast.error(error.message || "Could not delete profile");
    } finally {
      toast.dismiss(toastId);
    }
  };
}
