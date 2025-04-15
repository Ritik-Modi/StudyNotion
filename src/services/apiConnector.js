import axios from "axios";

// Create Axios instance with base URL and cookie credentials
export const axiosInstance = axios.create({
  baseURL: "http://localhost:4000", // Update to production URL when needed
  withCredentials: true, // ✅ Ensures cookies (like JWT token) are sent
});

// API connector function
export const apiConnector = async (
  method,
  url,
  bodyData = null,
  customHeaders = {},
  params = null
) => {
  try {
    // Automatically set correct Content-Type
    const headers = {
      "Content-Type":
        bodyData instanceof FormData
          ? "multipart/form-data"
          : "application/json",
      ...customHeaders,
    };

    // Make API call
    const response = await axiosInstance({
      method,
      url,
      data: bodyData,
      headers,
      params,
    });

    return response.data;
  } catch (error) {
    console.error("API ERROR:", error.response?.data || error.message);

    throw {
      success: false,
      message: error.response?.data?.message || "An unknown error occurred",
      statusCode: error.response?.status || 500,
      data: error.response?.data || null,
    };
  }
};
