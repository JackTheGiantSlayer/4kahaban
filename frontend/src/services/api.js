import axios from 'axios';

// Ensure baseURL doesn't conflict with leading slashes in component calls
// Dynamically determine baseURL if not provided via env
const dynamicBaseURL = `http://${window.location.hostname}:8000`;
const baseURL = import.meta.env.VITE_API_URL || dynamicBaseURL;

const api = axios.create({
    baseURL: baseURL,
});

// Request interceptor to add auth token and ensure /api/v1 prefix
api.interceptors.request.use(
    (config) => {
        // Force prefix /api/v1 if not present
        if (config.url && config.url.startsWith('/')) {
            config.url = '/api/v1' + config.url;
        } else if (config.url && !config.url.startsWith('api/v1')) {
            config.url = '/api/v1/' + config.url;
        }

        const token = localStorage.getItem('token');
        if (token) {
            config.headers['Authorization'] = `Bearer ${token}`;
        }
        return config;
    },
    (error) => Promise.reject(error)
);

export default api;
