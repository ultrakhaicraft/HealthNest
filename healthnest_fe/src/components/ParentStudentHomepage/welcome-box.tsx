import React from 'react';
import styles from '../../CSS/Parent/ParentHomepage.module.css'
import { UserRole } from '../../feature/Constant';

interface WelcomeProps {
  name: string|undefined;
  childName: string|undefined;
  avatarSrc: string;
  userType:string;
}

function Welcome({ name, childName, avatarSrc, userType }: WelcomeProps) {
  return (
    <section className={styles.welcomeCard}>
      <img src={avatarSrc} alt="User" className={styles.welcomeAvatar} />
      <div className={styles.welcomeText}>
        <p className={styles.welcomeGreeting}>Welcome back,</p>
        <h1 className={styles.welcomeName}>{name}</h1>
        <p className={styles.welcomeInfo}>
          {userType === UserRole.Parent ? (
            <span className={styles.studentIcon} role="img" aria-label="student icon">👨‍🎓</span>
          ) : (
            <span className={styles.parentIcon} role="img" aria-label="parent icon">👩‍👧</span>
          )}
          {userType === UserRole.Student && 'Class of 10A'}
          {userType === UserRole.Parent && <> Parent of: <span className={styles.childName}>{childName}</span></>}
        </p>
      </div>
    </section>
  );
}

export default Welcome;