import axios from "axios";
import Cookies from "js-cookie";

// Debug to verify environment variable
// console.log("API Base URL:", process.env.REACT_APP_HOST);

const api = axios.create({
  baseURL: `http://localhost:3000`,
  withCredentials: true, // For cookies/auth
  headers: {
    "Content-Type": "application/json", // Ensures proper JSON communication
  },
});

// Utility function to retrieve the access token from cookies using js-cookie
const getAuthTokenFromCookies = () => {
  // Try from localStorage first (set during login)
  const token = localStorage.getItem("token") || Cookies.get("token");
  return token;
};

// Function to handle GET requests
export const get = async (endpoint, params = {}) => {
  try {
    const token = getAuthTokenFromCookies(); // Get the token from cookies
    console.log(token, "token");

    const headers = token ? { Authorization: `Bearer ${token}` } : {};

    const response = await api.get(endpoint, { params, headers });
    return response.data; // Return data from the response
  } catch (error) {
    handleError(error);
    throw error;
  }
};

// Function to handle POST requests
export const post = async (endpoint, body = {}, isMultipart = false) => {
  try {
    const token = getAuthTokenFromCookies();
    const headers = token ? { Authorization: `Bearer ${token}` } : {};

    // If FormData, set appropriate headers
    if (isMultipart) {
      headers["Content-Type"] = "multipart/form-data";
    }

    const response = await api.post(endpoint, body, { headers });
    return response.data;
  } catch (error) {
    handleError(error);
    throw error;
  }
};

// Function to handle PUT requests
export const put = async (endpoint, body = {}) => {
  try {
    const token = getAuthTokenFromCookies(); // Get the token from cookies
    const headers = token ? { Authorization: `Bearer ${token}` } : {};

    const response = await api.put(endpoint, body, { headers });
    return response.data;
  } catch (error) {
    handleError(error);
    throw error;
  }
};

// Function to handle DELETE requests
export const del = async (endpoint) => {
  try {
    const token = getAuthTokenFromCookies(); // Get the token from cookies
    const headers = token ? { Authorization: `Bearer ${token}` } : {};

    const response = await api.delete(endpoint, { headers });
    return response.data;
  } catch (error) {
    handleError(error);
    throw error;
  }
};

// Utility function for handling errors
const handleError = (error) => {
  console.error("API Error:", error.response || error.message);
  alert(
    error.response?.data?.message || "An error occurred. Please try again."
  );
};
