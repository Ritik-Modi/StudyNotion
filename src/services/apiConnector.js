import axios from "axios";

export const axiosInstance = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL || "http://localhost:4000",
  withCredentials: true, // send cookies in cross-origin requests
});

export const apiConnector = async (
  method,
  url,
  bodyData = null,
  customHeaders = {},
  params = null
) => {
  try {
    const headers = {
      "Content-Type":
        bodyData instanceof FormData
          ? "multipart/form-data"
          : "application/json",
      ...customHeaders,
    };

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
