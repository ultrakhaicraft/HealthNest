import { Link } from 'react-router-dom';
import styles from '../../CSS/Guest/GuestHomePageNavBar.module.css'



export default function HomepageNavBar() {
  return (
    <header className={styles.header}>
        <div className={styles.headerContainer}>
          <div className={styles.headerLogo}>HealthNest</div>
          <nav className={styles.guestHomeNav}>
            <a href="/">Home</a>
            <a href="/blogs">Blog</a>           
          </nav>
          <Link to="/login" className={styles.loginButton}>Login</Link>
        </div>
    </header>
  );
}

