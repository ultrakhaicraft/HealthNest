import React, { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';

import { useAuth } from '../../../feature/API/RegisterService';
import { RegisterForm } from '../../../components/Authentication/register-form';
import { AuthLayout } from '../../../components/Authentication/auth-spilt-screen-layout';
import { Toast } from '../../../components/Notification/Toast';
import { UserTypeSelection } from '../../../components/Authentication/user-type-selection';
import '../../../app/CSS/Register.css'; 

const Register = () => {
    const navigate = useNavigate();
    const location = useLocation();

    const { register, isLoading, error, setError } = useAuth();

    const [registerData, setRegisterData] = useState({
        email: '',
        password: '',
        fullName: '',
        confirmPassword: '',
        phoneNumber: '',
        address: ''
    });

    const [toast, setToast] = useState({ isVisible: false, message: '', type: 'success' as 'success' | 'error' });
    const [userType, setUserType] = useState(''); 
    // Show selection screen initially
    const [showSelection, setShowSelection] = useState(true); 
    
    //Navigate to login page after successful registration
    //Set location state for location.state?.registrationSuccess
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


    //Change register data
    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        setRegisterData(prev => ({ ...prev, [name]: value }));
        if (error) setError(null); // Clear error on new input
    };

    const handleBackToSelection = () => {
        setShowSelection(true);
        setUserType('');
    };

    //Change user type
    const handleUserTypeChange = (userType: string) => {
        setUserType(userType);
        setShowSelection(false);
    };  

    //Submit registration form
    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        await register(registerData, userType);
    };

    return (
        <AuthLayout>
            <Toast 
                isVisible={toast.isVisible}
                message={toast.message}
                type={toast.type}
                onClose={() => setToast(prev => ({ ...prev, isVisible: false }))}
            />
            {showSelection ? (
                <UserTypeSelection 
                    onSelectUserType={handleUserTypeChange} 
                    navigate={navigate} 
                />
            ) : (
                <RegisterForm 
                    onBack={handleBackToSelection}
                    handleInputChange={handleInputChange}
                    handleSubmit={handleSubmit}
                    isLoading={isLoading}
                    error={error}
                    userType={userType}
                />
            )}
        </AuthLayout>
    );
};

export default Register;