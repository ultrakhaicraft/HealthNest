import React, { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';

import { useAuth } from '../../../feature/API/LoginService';
import { LoginForm } from '../../../components/Authentication/login-form';
import { AuthLayout } from '../../../components/Authentication/auth-spilt-screen-layout';
import { Toast } from '../../../components/Notification/Toast';
import '../../../app/CSS/Login.css'

const Login = () => {
    const navigate = useNavigate();
    const location = useLocation();
    
    // Custom hook for authentication logic
    const { login, isLoading, error, setError } = useAuth();
    
    // State for form inputs
    const [loginData, setLoginData] = useState({ email: '', password: '' });
    
    // State for toast notifications
    const [toast, setToast] = useState({ isVisible: false, message: '', type: 'success' as 'success' | 'error' });



    // Effect to show toast on successful registration
    useEffect(() => {
        if (location.state?.registrationSuccess) {
            setToast({
                isVisible: true,
                message: location.state.message || 'Registration successful! Please login.',
                type: 'success',
            });
            // Clear location state to prevent toast on refresh

            navigate('/login', { state: {}, replace: true });
        }
    }, [location.state, navigate]);

    
    
    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        setLoginData(prev => ({ ...prev, [name]: value }));
        if (error) setError(null); // Clear error on new input
    };

    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        await login(loginData);
    };

    return (
        <AuthLayout>
            <Toast 
                isVisible={toast.isVisible}
                message={toast.message}
                type={toast.type}
                onClose={() => setToast(prev => ({ ...prev, isVisible: false }))}
            />
            <LoginForm 
                handleInputChange={handleInputChange}
                handleSubmit={handleSubmit}
                isLoading={isLoading}
                error={error}
            />
        </AuthLayout>
    );
};

export default Login;