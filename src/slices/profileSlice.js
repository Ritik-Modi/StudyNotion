import { createSlice } from "@reduxjs/toolkit";
import axios from "axios";

const initialState = {
  user: localStorage.getItem("user")
    ? JSON.parse(localStorage.getItem("user"))
    : null,
  loading: false,
};

const profileSlice = createSlice({
  name: "profile",
  initialState,
  reducers: {
    setUser(state, action) {
      state.user = action.payload;
      localStorage.setItem("user", JSON.stringify(action.payload)); // Store in localStorage
    },
    setLoading(state, action) {
      state.loading = action.payload;
    },
  },
});

// Async function to fetch user profile
export const fetchUserProfile = () => async (dispatch) => {
  dispatch(setLoading(true));
  try {
    const response = await axios.get(
      "http://localhost:4000/api/v1/profile/getUserDetails",
      { withCredentials: true }
    );
    console.log("API Response:", response.data);
    dispatch(setUser(response.data.data));
  } catch (error) {
    console.error("Error fetching user profile:", error);
  } finally {
    dispatch(setLoading(false));
  }
};

export const { setUser, setLoading } = profileSlice.actions;
export default profileSlice.reducer;
