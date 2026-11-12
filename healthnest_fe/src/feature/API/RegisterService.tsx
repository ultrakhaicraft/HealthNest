import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { CreateStudentModel } from '../../models/AccountSubclassModels/StudentModel';
import { CreateParentModel } from '../../models/AccountSubclassModels/ParentModel';

// It's a good practice to use environment variables for API URLs
const API_URL = import.meta.env.VITE_API_URL || 'https://localhost:7085/api';

type RegisterRole = 'parent' | 'student';


export const useAuth = () => {
    const navigate = useNavigate();
    const [error, setError] = useState<string | null>(null);
    const [isLoading, setIsLoading] = useState(false);

    const submitRegistration = async (role: RegisterRole, registerData: CreateParentModel | CreateStudentModel) => {

        setIsLoading(true);
        setError(null); // Clear previous error

        if (registerData.password !== registerData.confirmPassword) {
            setError('Passwords do not match.');
            return;
        }

        try {
            const response = await axios.post(`${API_URL}/auth/register/${role}`, registerData,
                {
                    headers: {
                        'Content-Type': 'application/json'
                    },
                    timeout: 5000 // Set timeout to 5 seconds
                });


            // Check if response is successful
            console.log('Registration response:', response.data);
            // Redirect to UserHome
            navigate('/login', {
                state: {
                    registrationSuccess: true,
                    message: 'Registration successful! Please login with your credentials.',
                    userType: role
                },
                replace: true
            });


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

    const registerAsParent = async (registerData: CreateParentModel) => {
        await submitRegistration('parent', registerData);
    }

    const registerAsStudent = async (registerData: CreateStudentModel) => {
        await submitRegistration('student', registerData);
    }

    return { registerAsParent, registerAsStudent, isLoading, error, setError };
};