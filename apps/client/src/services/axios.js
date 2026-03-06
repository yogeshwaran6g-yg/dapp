// src/services/http.js
import axios from "axios";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
const API_BASE_URL = import.meta.env.VITE_API_URL;

/**
 * Create Axios instance
 */
const http = axios.create({
  baseURL: API_BASE_URL,
  timeout: 30000,
  headers: {
    Accept: "application/json",
    "ngrok-skip-browser-warning": "true",
  },
});

/**
 * Request Interceptor
 * Attach auth token
 */
http.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("authToken");

    if (token && token !== 'undefined' && token !== 'null') {
      config.headers.Authorization = `Bearer ${token}`;
    }

    // Handle FormData and standard objects
    if (config.data instanceof FormData) {
      delete config.headers["Content-Type"];
    } else if (config.data && typeof config.data === "object") {
      config.headers["Content-Type"] = "application/json";
    }

    return config;
  },
  (error) => Promise.reject(error)
);

/**
 * Response Interceptor
 * Handle success and error responses with toast notifications
 */
http.interceptors.response.use(
  (response) => {
    // Handle success responses with toast notifications
    const { data, config } = response;

    // Show success toast ONLY if explicitly enabled in the request config
    if (config.showSuccessToast) {
      const message = data?.message || "Operation completed successfully";
      toast.success(message, {
        autoClose: 3000,
      });
    }

    return data;
  },
  (error) => {
    const status = error?.response?.status;
    const data = error?.response?.data;

    // Normalize error
    const message =
      data?.message ||
      error?.message ||
      "Something went wrong";

    const normalizedError = {
      status,
      message,
      data: data?.data || null,
      raw: error,
    };

    // Log error for debugging
    console.error(`[API Error] ${error.config?.url}:`, message);

    // Show error toast if enabled
    if (error.config?.showErrorToast !== false) {
      // Don't show toast for 404 on profile (often expected for new users)
      const isProfileGet = error.config?.url?.includes('/api/v1/profile/') && error.config?.method === 'get';

      if (!(status === 404 && isProfileGet)) {
        toast.error(message, {
          autoClose: 4000,
        });
      }
    }


    if (status === 401) {
      console.warn("[API] 401 Unauthorized - Clearing session...");
      localStorage.removeItem("authToken");
      localStorage.removeItem("user");

      setTimeout(() => {
        window.location.reload();
      }, 2000);
    }

    return Promise.reject(normalizedError);
  }
);

/**
 * Standard error handler for services
 */
export const handleServiceError = (error, context) => {
  console.error(`${context} Error:`, error.message || error);
  throw error;
};




export const api = {
  get: (url, params = {}, config = {}) => http.get(url, { ...config, params }),
  post: (url, data = {}, config = {}) => http.post(url, data, config),
  put: (url, data = {}, config = {}) => http.put(url, data, config),
  delete: (url, config = {}) => http.delete(url, config),
};

export default api;

