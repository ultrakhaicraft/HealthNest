import React, { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '../../../feature/API/RegisterService';
import { RegisterForm } from '../../../components/Authentication/register-form';
import { AuthLayout } from '../../../components/Authentication/auth-layout';
import { Toast } from '../../../components/Notification/Toast';
import { UserTypeSelection } from '../../../components/Authentication/user-type-selection';
import { RegisterRequest } from '../../../models/AccountModel';
import { ChangeHandler, ParentExtraData, ParentExtraFields, StudentExtraData, StudentExtraFields } from '../../../components/Authentication/register-extra-field';

export interface RegisterFormData extends RegisterRequest {
    parentId?: string;
    class?: string;
    relationshipStatus?: string;
    incomeLevel?: string;
}

const INITIAL_FORM: RegisterFormData = {
    fullName: '', email: '', password: '', confirmPassword: '',
    phoneNumber: '', address: '', gender: '', dateOfBirth: '',
    parentId: '',
    class: '',
    relationshipStatus: '',
    incomeLevel: '',
};


const Register = () => {
    const navigate = useNavigate();
    const location = useLocation();

    const { registerAsStudent, registerAsParent, isLoading, error, setError } = useAuth();

    const [registerData, setRegisterData] = useState<RegisterFormData>(INITIAL_FORM);
    const [parentExtra, setParentExtra] = useState<ParentExtraData>({ relationshipStatus: '', incomeLevel: '' });
    const [studentExtra, setStudentExtra] = useState<StudentExtraData>({ class: ''});

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
    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
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
    const handleParentExtraChange: ChangeHandler = (e) => {
        const { name, value } = e.target;
        setParentExtra(prev => ({ ...prev, [name]: value }));
        if (error) setError(null);
    };

    const handleStudentExtraChange: ChangeHandler = (e) => {
        const { name, value } = e.target;
        setStudentExtra(prev => ({ ...prev, [name]: value }));
        if (error) setError(null);
    };

    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        if (userType === 'parent') await registerAsParent({ ...registerData, ...parentExtra });
        else if (userType === 'student') await registerAsStudent({ ...registerData, ...studentExtra });
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
                    formData={registerData}
                    handleInputChange={handleInputChange}
                    handleSubmit={handleSubmit}
                    isLoading={isLoading}
                    error={error}
                    userType={userType}
                    extraFields={
                        userType === 'parent'
                            ? <ParentExtraFields data={parentExtra} onChange={handleParentExtraChange} disabled={isLoading} />
                            : <StudentExtraFields data={studentExtra} onChange={handleStudentExtraChange} disabled={isLoading} />
                    }
                />
            )}
        </AuthLayout>
    );
};

export default Register;