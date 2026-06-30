import React from 'react';

import '../../app/CSS/Login.css'

interface AuthLayoutProps {
  children: React.ReactNode;
}

//// This component provides a split-screen layout for authentication pages
// The left side can be customized with a logo and tagline, while the right side contains the authentication form
export const AuthLayout = ({ children }: AuthLayoutProps) => {
  return (
    <div className='flex-page'>
      <div className='child left-side'>
        <div className='logo'>Starlight Academy</div>
        <div className='tagline'>Empowering Minds, Nurturing Health</div>
      </div>
      <div className='child right-side'>
        {children}
      </div>
    </div>
  );
};