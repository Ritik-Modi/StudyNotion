import { toast } from "react-hot-toast";
import { resetCart } from "../../slices/cartSlice";
import { setToken, setLoading } from "../../slices/authSlice";
import { setUser } from "../../slices/profileSlice";
import { endpoints } from "../apis";
import { apiConnector } from "../apiConnector";

const {
  SENDOTP_API,
  SIGNUP_API,
  LOGIN_API,
  RESETPASSTOKEN_API,
  RESETPASSWORD_API,
} = endpoints;
export function sendOtp(email, navigate) {
  return async (dispatch) => {
    const toastId = toast.loading("Loading...");
    dispatch(setLoading(true));

    try {
      const response = await apiConnector("POST", SENDOTP_API, {
        email,
        checkUserPresent: true,
      });

      console.log("SENDOTP_API response:", response);

      if (!response.data.success) {
        throw new Error(response.data.message);
      }

      toast.success("OTP sent successfully");
      navigate("/verify-email");
    } catch (error) {
      console.error("SENDOTP API ERROR:", error);
      toast.error(error?.response?.data?.message || "Could Not Send OTP");
    }

    dispatch(setLoading(false));
    toast.dismiss(toastId);
  };
}

export function signup(
  accountType,
  firstName,
  lastName,
  email,
  password,
  confirmPassword,
  otp,
  navigate
) {
  return async (dispatch) => {
    const toastId = toast.loading("Loading...");
    dispatch(setLoading(true));
    try {
      const response = await apiConnector("POST", SIGNUP_API, {
        accountType,
        firstName,
        lastName,
        email,
        password,
        confirmPassword,
        otp,
      });

      console.log("SIGNUP_API response: " + JSON.stringify(response));
      if (!response.data.success) {
        throw new Error(response.data.message);
      }
      toast.success("Signup successful");
      navigate("/login");
    } catch (error) {
      console.log("SIGNUP API ERROR............", error);
      toast.error("Could Not Signup");
      navigate("/signup");
    }
    dispatch(setLoading(false));
    toast.dismiss(toastId);
  };
}

export function login(email, password, navigate) {
  return async (dispatch) => {
    const toastId = toast.loading("Loading...");
    dispatch(setLoading(true));

    try {
      const response = await apiConnector("POST", LOGIN_API, {
        email,
        password,
      });

      console.log("LOGIN_API response:", response);

      if (!response.success) {
        throw new Error(response.message || "Login failed");
      }

      toast.success(response.message || "Login successful");

      // Extract token from response header
      const authHeader =
        response.headers?.authorization || response.headers?.Authorization;
      const headerToken = authHeader ? authHeader.replace("Bearer ", "") : null;

      // Extract token from cookie
      const cookieToken = getCookie("token");

      // From the screenshots, it looks like the token is directly in the response, not in response.data
      const token = headerToken || cookieToken || response.token;
      const user = response.user; // Similarly, user is directly in response, not in response.data

      if (!token || !user) {
        throw new Error("Invalid response: Missing token or user data");
      }

      // Store token as string, not as JSON string
      dispatch(setToken(token));
      localStorage.setItem("token", token); // Don't stringify token if it's already a string

      // Generate avatar URL if image is missing
      const userImg =
        user?.image ||
        `https://api.dicebear.com/9.x/initials/svg?seed=${encodeURIComponent(
          user.firstName + " " + user.lastName
        )}`;

      dispatch(setUser({ ...user, image: userImg }));
      localStorage.setItem("user", JSON.stringify({ ...user, image: userImg }));

      navigate("/dashboard/my-profile");
    } catch (error) {
      console.error("LOGIN API ERROR:", error);
      toast.error(error.message || "Could Not Login");
    } finally {
      dispatch(setLoading(false));
      toast.dismiss(toastId);
    }
  };
}

// Helper function to extract cookie by name
function getCookie(name) {
  const cookieArr = document.cookie.split(";");

  for (let i = 0; i < cookieArr.length; i++) {
    const cookiePair = cookieArr[i].split("=");
    const cookieName = cookiePair[0].trim();

    if (cookieName === name) {
      return decodeURIComponent(cookiePair[1]);
    }
  }

  return null;
}

export function logout(navigate) {
  return (dispatch) => {
    dispatch(setToken(null));
    dispatch(setUser(null));
    dispatch(resetCart());
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    toast.success("Logged out successfully");
    if (navigate) navigate("/");
  };
}

export function getPasswordResetToken(email, setEmailSent) {
  return async (dispatch) => {
    dispatch(setLoading(true));
    try {
      const response = await apiConnector("POST", RESETPASSTOKEN_API, {
        email,
      });

      console.log("RESET PASSWORD TOKEN RESPONSE....", response);

      if (!response.data.success) {
        throw new Error(response.data.message);
      }

      toast.success("Reset Email Sent");
      setEmailSent(true);
    } catch (error) {
      console.log("RESET PASSWORD TOKEN Error", error);
      toast.error("Failed to send email for resetting password");
    }
    dispatch(setLoading(false));
  };
}

export function resetPassword(password, confirmPassword, token) {
  return async (dispatch) => {
    dispatch(setLoading(true));
    try {
      const response = await apiConnector("POST", RESETPASSWORD_API, {
        password,
        confirmPassword,
        token,
      });

      console.log("RESET Password RESPONSE ... ", response);

      if (!response.data.success) {
        throw new Error(response.data.message);
      }

      toast.success("Password has been reset successfully");
    } catch (error) {
      console.log("RESET PASSWORD TOKEN Error", error);
      toast.error("Unable to reset password");
    }
    dispatch(setLoading(false));
  };
}
