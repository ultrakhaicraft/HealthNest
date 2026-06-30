

interface RegisterFormProps {
    onBack: (e: React.MouseEvent<HTMLButtonElement>) => void;
    handleInputChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
    handleSubmit: (e: React.FormEvent<HTMLFormElement>) => void;
    isLoading: boolean;
    error: string | null;
    userType: string;
}

export const RegisterForm = ({ onBack, handleInputChange, handleSubmit, isLoading, error, userType }: RegisterFormProps) => {
    

    return(
    <div className='register-form'>
            <div className='form-header'>
                <button type='button' className='primary-btn back-btn' onClick={onBack}>
                    ← Back
                </button>

                {userType === 'parent' ? <h1>Parent Registration</h1> : <h1>Student Registration</h1>}
                
            </div>
            {error && <div className="error-message">{error}</div>}      

            <form onSubmit={handleSubmit}>
                <div className='input-group'>
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
                <div className='input-group'>
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
                <div className='input-group'>
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
                <div className='input-group'>
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
                <div className='input-group'>
                    <label htmlFor='phoneNumber'>Phone Number</label>
                    <input 
                    type='tel' 
                    id='phoneNumber' 
                    name='phoneNumber' 
                    onChange={handleInputChange}
                    placeholder='Enter your phone number'
                    disabled={isLoading}                  
                    required/>
                </div>
                <div className='input-group'>
                    <label htmlFor='address'>Address</label>
                    <input type='text' 
                    id='address' 
                    name='address' 
                    onChange={handleInputChange}
                    placeholder='Enter your address'
                    disabled={isLoading}                  
                    required />
                </div>
                <button className='primary-btn' type='submit' disabled={isLoading}>
                    {isLoading ? 'Registering...' : 'Register'}
                </button>
            </form>
        </div>
    );
};