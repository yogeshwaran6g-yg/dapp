import axios from "axios";
import { toast } from "react-hot-toast";

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;


const http = axios.create({
    baseURL: API_BASE_URL,
    timeout: 15000,
    headers: {
        Accept: "application/json",
        "ngrok-skip-browser-warning": "true",
    },
});


http.interceptors.request.use(
    (config) => {
        const token = localStorage.getItem("authToken");

        if (token) {
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


http.interceptors.response.use(
    (response) => {
        // Handle success responses with toast notifications
        const { data, config } = response;

        // Show success toast ONLY if explicitly enabled in the request config
        if (config.showSuccessToast) {
            const message = data?.message || "Operation completed successfully";
            toast.success(message);
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

        // Optionally show error toast
        if (error.config?.showErrorToast !== false) {
            toast.error(message);
        }

        return Promise.reject(normalizedError);
    }
);


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

export default http;
