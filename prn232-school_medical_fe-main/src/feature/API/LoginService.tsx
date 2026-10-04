import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { UserRole } from '../Constant';
import { ApiErrorResponse, ApiResponseWrapper } from '../../models/ApiClientModel';
import apiClient from '../ApiClient';
import { AuthUser } from '../../models/AccountModel';

// It's a good practice to use environment variables for API URLs
const API_URL = import.meta.env.VITE_API_URL || 'https://localhost:7085/api';


export const useAuth = () => {
    const navigate = useNavigate();
    const [error, setError] = useState<string | null>(null);
    const [isLoading, setIsLoading] = useState(false);

    const login = async (credentials: { email: string; password: any; }) => {
        setIsLoading(true);
        setError(null);

        if (!credentials.email || !credentials.password) {
            setError('Please fill in your email and password.');
            setIsLoading(false);
            return;
        }

        try {
            const response = await axios.post(`${API_URL}/auth/login`, credentials, {
                headers: { 'Content-Type': 'application/json' },
                withCredentials: true,
                timeout: 8000
            });


            // Access the nested data object
            console.log("Storing Info");
            const userData = response.data.data;
            storeInfoToLocalStorage(userData);

            // Navigate to the user's homepage upon successful login
            // Depend on the role of the user, you might want to navigate to different pages
            console.log("Navigating...");
            navigate(handleNavigateAfterLogin(userData));

        } catch (err: ApiErrorResponse | any) {

            //Use the interface ApiErrorResponse to type the error response from the API
            //Check if the api actually return an error response, if not, it might be a network error or some other issue
            if (err.response) {
                const errorMessage = err.response.data?.message;
                const errorDetail = err.response.data?.detail;
                console.log('Login Error detail:', errorDetail);
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

    const logout = async () => {
       try {
        await axios.post(`${API_URL}/auth/logout`, null, { withCredentials: true });
        } finally {
            localStorage.removeItem('userRole');
            localStorage.removeItem('userId');
            localStorage.removeItem('userName');
            localStorage.removeItem('accountDetail');
            sessionStorage.removeItem('isAuthenticated');
            navigate('/login');
        }
    }

    const getAuthUserFromCookie = async () : Promise<AuthUser> => {
        const response = await apiClient.get<ApiResponseWrapper<AuthUser>>('/auth/me');
        return response.data.data as AuthUser
    }

    const storeInfoToLocalStorage = (userData: any) => {
        // Store user data from the data object
        if (userData.role) {
            localStorage.setItem('userRole', userData.role);
        }

        if (userData.id) {
            localStorage.setItem('userId', userData.id);
        }

        if (userData.fullName) {
            localStorage.setItem('userName', userData.fullName);
        }

    }

    const handleNavigateAfterLogin = (userData: any): string =>{
        let homePageUrl: string = '';
            switch (userData.role) {
                case UserRole.Student: homePageUrl='/student'; break;
                case UserRole.Parent: homePageUrl='/parent'; break;
                case UserRole.Nurse: homePageUrl='/nurse'; break;
                case UserRole.Admin: homePageUrl='/admin'; break;
            }
        return homePageUrl;
    }

    return { logout, login, getAuthUserFromCookie, isLoading, error, setError };
};