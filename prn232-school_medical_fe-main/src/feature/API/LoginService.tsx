import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

// It's a good practice to use environment variables for API URLs
const API_URL = import.meta.env.VITE_API_URL || 'https://localhost:7085/api';

export const useAuth = () => {
    const navigate = useNavigate();
    const [error, setError] = useState<string | null>(null);
    const [isLoading, setIsLoading] = useState(false);

    const login = async (credentials: { email: string; password: any; }) => {
        setIsLoading(true);
        setError(null);

        console.log('Login attempt with credentials:', credentials);

        if (!credentials.email || !credentials.password) {
            setError('Please fill in all fields');
            setIsLoading(false);
            return;
        }

        try {
            const response = await axios.post(`${API_URL}/auth/login`, credentials, {
                headers: { 'Content-Type': 'application/json' },
                timeout: 8000
            });

           // Access the nested data object
            const userData = response.data.data;
            const tokenData = userData.token;

            // Store the token
            if (tokenData && tokenData.tokenString) {
                localStorage.setItem('authToken', tokenData.tokenString);
            }

            // Store user data from the data object
            if (userData.role) {
                localStorage.setItem('userRole', userData.role);
            }

            if (userData.id) {
                localStorage.setItem('userId', userData.id);
            }

            

            console.log('Login successful:', response.data);

            // Navigate to the user's homepage upon successful login
            // Depend on the role of the user, you might want to navigate to different pages
            if(userData.role === 'Student') {
                navigate('/studentHomepage');
            } else if(userData.role === 'Parent') {
                navigate('/parentHomepage'); 
            } else if(userData.role === 'SchoolNurse') {
                navigate('/nurseHomepage');
            }

            

        } catch (err: any) {
            if (err.response) {
                const errorMessage = err.response.data?.message || err.response.data?.error || `Error: ${err.response.status}`;
                setError(errorMessage);
            } else if (err.request) {
                setError('Network error. Please check your connection.');
            } else {
                setError('An unexpected error occurred. Please try again.');
            }
        } finally {
            setIsLoading(false);
        }
    };

    return { login, isLoading, error, setError };
};