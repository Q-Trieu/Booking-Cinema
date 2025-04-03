import axios from "axios";

const AxiosInstance = axios.create({
    baseURL: "http://localhost:5000/api", // Base URL for the backend API
    timeout: 10000, // Request timeout in milliseconds
    headers: {
        "Content-Type": "application/json", // Default content type
    },
});

// Add a request interceptor
AxiosInstance.interceptors.request.use(
    (config) => {
        // Add authorization token if available
        const token = sessionStorage.getItem("access_token");
        if (token) {
            config.headers.Authorization = `Bearer ${token}`;
        }
        return config;
    },
    (error) => {
        // Handle request error
        return Promise.reject(error);
    }
);

// Add a response interceptor
AxiosInstance.interceptors.response.use(
    (response) => {
        // Handle successful response
        return response;
    },
    (error) => {
        // Handle response error
        if (error.response?.status === 401) {
            // Handle unauthorized error (e.g., redirect to login)
            console.error("Unauthorized! Redirecting to login...");
        }
        return Promise.reject(error);
    }
);

export default AxiosInstance;