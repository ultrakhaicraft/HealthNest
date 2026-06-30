import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

// It's a good practice to use environment variables for API URLs
const API_URL = import.meta.env.VITE_API_URL || 'https://localhost:7085/api';

export const useAuth = () => {
    const navigate = useNavigate();
    const [error, setError] = useState<string | null>(null);
    const [isLoading, setIsLoading] = useState(false);

    const register = async (registerData: 
        { email: string; password: any; fullName: string; confirmPassword: string; phoneNumber: string; address: string; }, 
        userType: string) => {

        var flag='';
        setIsLoading(true);
        setError(null); // Clear previous error

        if(userType==='parent') {
            flag='?IsParent=true';
        }else if(userType==='student') {
            flag='?IsParent=false';
        }

        try{
            const response = await axios.post(`${API_URL}/auth/register${flag}`, {
                fullName: registerData.fullName,
                email: registerData.email,
                password: registerData.password,
                confirmPassword: registerData.confirmPassword,
                phoneNumber: registerData.phoneNumber,
                address: registerData.address
            },{
                headers: {
                    'Content-Type': 'application/json'
                },
                timeout: 5000 // Set timeout to 5 seconds
            });

            console.log('Response:', response.data);

            // Check if response is successful
            if (response.status == 200) {              
                
                console.log('Registration successful:', response.data);

                // Redirect to UserHome
                navigate('/login', { 
                    state: { 
                        registrationSuccess: true,
                        message: 'Registration successful! Please login with your credentials.',
                        userType: userType
                    },
                    replace: true
                });
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

    return { register, isLoading, error, setError };
};