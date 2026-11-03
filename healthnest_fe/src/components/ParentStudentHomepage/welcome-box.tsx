import styles from '../../CSS/Parent/ParentHomepage.module.css'
import { UserRole } from '../../feature/Constant';

interface WelcomeProps {
  name: string|undefined;
  avatarSrc: string;
  userType:string;
}

function Welcome({ name, avatarSrc, userType }: WelcomeProps) {
  return (
    <section className={styles.welcomeCard}>
      <img src={avatarSrc} alt="User" className={styles.welcomeAvatar} />
      <div className={styles.welcomeText}>
        <p className={styles.welcomeGreeting}>Welcome back, {name}</p>
        <h1 className={styles.welcomeName}>This is your dashboard page</h1>
        <p className={styles.welcomeInfo}>
          {userType === UserRole.Student ? (
            <span className={styles.studentIcon} role="img" aria-label="student icon">You are currently logged in as Student, 👨‍🎓</span>
          ) : (
            <span className={styles.parentIcon} role="img" aria-label="parent icon">You are currently logged in as Parent, 👩‍👧</span>
          )}
          {userType === UserRole.Student && 'Class of 10A'}
        </p>
      </div>
    </section>
  );
}

export default Welcome;