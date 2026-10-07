import React from 'react';

import styles from '../../CSS/Guest/AuthLayout.module.css';

interface AuthLayoutProps {
  children: React.ReactNode;
}

//// This component provides a split-screen layout for authentication pages
// The left side can be customized with a logo and tagline, while the right side contains the authentication form
export const AuthLayout = ({ children }: AuthLayoutProps) => {
  return (
     <div className={styles.authPage}>
      <div className={styles.leftSide}>
        <div className={styles.logo}>HealthNest</div>
        <div className={styles.tagline}>Safe and sound school healthcare service</div>
      </div>
      <div className={styles.rightSide}>
        {children}
      </div>
    </div>
  );
};