import axios from 'axios';

// Create Axios client instance
const axiosClient = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL || 'http://localhost:8000/api',
  headers: {
    'Content-Type': 'application/json',
    'Accept': 'application/json',
  },
});

// Request Interceptor: Automatically attach Sanctum token if available
axiosClient.interceptors.request.use(
  (config) => {
    // Check local storage for voter token or admin token
    // Using a common 'auth_token' or separate depending on session setup
    const token = localStorage.getItem('auth_token') || sessionStorage.getItem('auth_token');
    
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response Interceptor: Global error handler
axiosClient.interceptors.response.use(
  (response) => {
    // Return the core data directly if wrapped in standard Laravel JSON resource
    return response.data;
  },
  (error) => {
    if (error.response) {
      const { status } = error.response;

      // 401 Unauthorized: Session expired or invalid token
      if (status === 401) {
        localStorage.removeItem('auth_token');
        localStorage.removeItem('user_role');
        sessionStorage.removeItem('auth_token');
        sessionStorage.removeItem('user_role');
        
        // Redirect to appropriate login page based on window pathname
        const isAdminRoute = window.location.pathname.startsWith('/admin');
        if (isAdminRoute) {
          window.location.href = '/admin/login';
        } else {
          window.location.href = '/login';
        }
      }
    }
    
    return Promise.reject(error);
  }
);

export default axiosClient;
