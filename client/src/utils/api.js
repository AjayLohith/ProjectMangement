import axios from 'axios';

// Use environment variable for API URL in production, or proxy in development
const API_URL = import.meta.env.VITE_API_URL || '/api';

const api = axios.create({
    baseURL: API_URL,
    withCredentials: true,
    headers: {
        'Content-Type': 'application/json'
    },
    timeout: 10000, // 10 second timeout
});

// Request interceptor
api.interceptors.request.use(
    (config) => {
        return config;
    },
    (error) => {
        return Promise.reject(error);
    }
);

// Response interceptor: on 401, signal logout so AuthContext can redirect via React Router (no full page refresh)
api.interceptors.response.use(
    (response) => response,
    (error) => {
        if (error.response?.status === 401) {
            window.dispatchEvent(new CustomEvent('auth:logout'));
        } else if (error.request) {
            error.message = 'Network error. Please check your connection.';
        }
        return Promise.reject(error);
    }
);

export default api;
