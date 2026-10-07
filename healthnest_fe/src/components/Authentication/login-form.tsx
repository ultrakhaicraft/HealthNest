import React from 'react';
import loginStyles from '../../CSS/Guest/AuthLayout.module.css';
import inputStyles from '../../CSS/InputField.module.css';

interface LoginFormProps {
  handleInputChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  handleSubmit: (e: React.FormEvent<HTMLFormElement>) => void;
  isLoading: boolean;
  error: string | null;
}

export const LoginForm = ({ handleInputChange, handleSubmit, isLoading, error }: LoginFormProps) => {
  return (
    <div className={loginStyles.loginForm}>
      <h1>Login</h1>
      <form onSubmit={handleSubmit}>
        {error && <div className={loginStyles.errorMessage}>{error}</div>}
        
        <div className={inputStyles.inputGroup}>
          <label htmlFor='email'>Email</label>
          <input
            type='email'
            id='email'
            name='email'
            onChange={handleInputChange}
            placeholder='Enter your email'
            disabled={isLoading}
            required
          />
        </div>
        
        <div className={inputStyles.inputGroup}>
          <label htmlFor='password'>Password</label>
          <input
            type='password'
            id='password'
            name='password'
            onChange={handleInputChange}
            placeholder='Enter your password'
            disabled={isLoading}
            required
          />
        </div>
        
        <button className='primary-btn' type='submit' disabled={isLoading}>
          {isLoading ? 'Logging in...' : 'Login'}
        </button>
      </form>
      <div className='register-link'>
        <p>Don't have an account? <a href="/register">Register here</a></p>
      </div>
    </div>
  );
};