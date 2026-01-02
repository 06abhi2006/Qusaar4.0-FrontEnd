import axios from 'axios';

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:3000/api';

// Flag to prevent multiple simultaneous redirects
let isRedirecting = false;

export const apiClient = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

apiClient.interceptors.request.use(
  (config) => {
    const token = sessionStorage.getItem('auth_token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

apiClient.interceptors.response.use(
  (response) => response,
  (error) => {
    // Only handle 401 errors (authentication failures)
    // Exclude login endpoint, network errors, and if already redirecting
    if (
      error.response?.status === 401 && 
      !error.config?.url?.includes('/auth/login') &&
      window.location.pathname !== '/login' &&
      !isRedirecting
    ) {
      // Set redirecting flag
      isRedirecting = true;
      
      // Clear invalid tokens
      sessionStorage.removeItem('auth_token');
      sessionStorage.removeItem('user_data');
      
      // Only redirect if not already on login page
      // Use a small delay to prevent race conditions
      setTimeout(() => {
        if (window.location.pathname !== '/login') {
          window.history.replaceState(null, '', '/login?session_expired=true');
          window.dispatchEvent(new PopStateEvent('popstate'));
        }
        // Reset flag after redirect
        setTimeout(() => {
          isRedirecting = false;
        }, 1000);
      }, 100);
    }
    return Promise.reject(error);
  }
);

export default apiClient;
