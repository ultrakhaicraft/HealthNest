//Creating a central client allows you to configure base URLs, headers, and interceptors 
// (e.g., to automatically attach auth tokens) in one place.

import axios from 'axios';

export interface PaginatedResponse<T> {
  pageIndex: number;
  totalPages: number;
  pageSize: number;
  totalCount: number;
  hasPrevious: boolean;
  hasNext: boolean;
  data: T[];
}

export interface RawApiResponse<T> {
  statusCode: string;
  message: string;
  data: T;
}

// Get the API URL from environment variables for security and flexibility
const API_URL = import.meta.env.VITE_API_URL || 'https://localhost:7085/api';

const apiClient = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// === Request Interceptor ===
// This function will be called before every request is sent.
apiClient.interceptors.request.use(
  (config) => {
    // Retrieve the token from localStorage
    const token = localStorage.getItem('authToken');
    
    // If the token exists, add it to the Authorization header
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    
    return config;
  },
  (error) => {
    // Handle request errors
    return Promise.reject(error);
  }
);

export default apiClient;