import registerStyles from '../../CSS/Guest/AuthLayout.module.css';
import inputStyles from '../../CSS/InputField.module.css';
import { RegisterRequest } from '../../models/AccountModel';

interface RegisterFormProps {
    onBack: (e: React.MouseEvent<HTMLButtonElement>) => void;
    handleInputChange: (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => void;
    handleSubmit: (e: React.FormEvent<HTMLFormElement>) => void;
    isLoading: boolean;
    error: string | null;
    userType: string;
    formData: RegisterRequest;
    extraFields: React.ReactNode;

}

export const RegisterForm = ({ onBack, handleInputChange, handleSubmit, isLoading, error, userType, extraFields }: RegisterFormProps) => {
    const today = new Date().toISOString().split('T')[0];


    return (
        <div className={registerStyles.registerForm}>
            <div className='form-header' >
                <button type='button' className={`button-secondary button ${registerStyles.backBtn}`} onClick={onBack}>
                    ← Back
                </button>

                {userType === 'parent' ? <h1>Parent Registration</h1> : <h1>Student Registration</h1>}

            </div>
            {error && <div className={registerStyles.errorMessage}>{error}</div>}

            <form onSubmit={handleSubmit}>
                <div className={registerStyles.grid}>
                    <div className={inputStyles.inputGroup}>
                        <label htmlFor='fullName'>Full Name</label>
                        <input
                            type='text'
                            id='fullName'
                            name='fullName'
                            onChange={handleInputChange}
                            placeholder='Enter your full name'
                            disabled={isLoading}
                            required />
                    </div>
                    <div className={inputStyles.inputGroup}>
                        <label htmlFor='email'>Email</label>
                        <input
                            type='email'
                            id='email'
                            name='email'
                            onChange={handleInputChange}
                            placeholder='Enter your email'
                            disabled={isLoading}
                            required />
                    </div>
                </div>
                <div className={registerStyles.grid}>
                    <div className={inputStyles.inputGroup}>
                        <label htmlFor='password'>Password</label>
                        <input
                            type='password'
                            id='password'
                            name='password'
                            onChange={handleInputChange}
                            placeholder='Enter your password'
                            disabled={isLoading}
                            required />
                    </div>
                    <div className={inputStyles.inputGroup}>
                        <label htmlFor='confirmPassword'>Confirm Password</label>
                        <input
                            type='password'
                            id='confirmPassword'
                            name='confirmPassword'
                            onChange={handleInputChange}
                            placeholder='Enter your confirm password'
                            disabled={isLoading}
                            required />
                    </div>
                </div>
                <div className={registerStyles.grid}> 
                    <div className={inputStyles.inputGroup}>
                        <label htmlFor='phoneNumber'>Phone Number</label>
                        <input
                            type='tel'
                            id='phoneNumber'
                            name='phoneNumber'
                            onChange={handleInputChange}
                            placeholder='Enter your phone number'
                            disabled={isLoading}
                            required />
                    </div>

                    <div className={inputStyles.inputGroup}>
                        <label htmlFor='gender'>Gender</label>
                        <select id='gender' name='gender'
                            onChange={handleInputChange} disabled={isLoading} required>
                            <option value=''>Select gender...</option>
                            <option value='Male'>Male</option>
                            <option value='Female'>Female</option>
                            <option value='Other'>Other</option>
                        </select>
                    </div>
                </div>
                <div className={inputStyles.inputGroup}>
                    <label htmlFor='address'>Address</label>
                    <input type='text'
                        id='address'
                        name='address'
                        onChange={handleInputChange}
                        placeholder='Enter your address'
                        disabled={isLoading}
                        required />
                </div>

                <div className={registerStyles.grid}>
                <div className={inputStyles.inputGroup}>
                    <label htmlFor='dateOfBirth'>Date of Birth</label>
                    <input type='date' id='dateOfBirth' name='dateOfBirth'
                        max={today}
                        onChange={handleInputChange}
                        disabled={isLoading} required />
                </div>

                {extraFields}
                </div>

                <button className='button-primary button' type='submit' disabled={isLoading}>
                    {isLoading ? 'Registering...' : 'Register'}
                </button>
            </form>
        </div>
    );
};