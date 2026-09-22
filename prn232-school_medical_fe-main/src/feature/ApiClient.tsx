//Creating a central client allows you to configure base URLs, headers, and interceptors 
// (e.g., to automatically attach auth tokens) in one place.

import axios from 'axios';

// Get the API URL from environment variables for security and flexibility
const API_URL = import.meta.env.VITE_API_URL || 'https://localhost:7085/api';

const apiClient = axios.create({
  baseURL: API_URL,
  withCredentials: true, 
  headers: {
    'Content-Type': 'application/json',
  },
});


// Global 401 handling: session expired -> clear local UI state, go to login
apiClient.interceptors.response.use(
  (res) => res,
  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem('userRole');
      localStorage.removeItem('userId');
      localStorage.removeItem('userName');
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);

export default apiClient;