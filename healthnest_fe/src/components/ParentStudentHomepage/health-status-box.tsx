import { UserRole } from "../../feature/Constant";
import styles from '../../CSS/Parent/ParentHomepage.module.css'

interface HealthStatusProps {
    lastCheckupDate: string;
    userType: string; // Optional prop for user type
}




function HealthStatus({lastCheckupDate, userType} : HealthStatusProps) {
  console.log("User role for HealthStatus: ", userType);
    return(
        <section className={styles.healthStatusCard}>
      <div className={styles.healthStatusIconArea}>
        {/* Replace with <img src="/assets/shield-heart-icon.svg" alt="Safe & Healthy" className="status-icon" /> */}
        <div className={styles.statusIconWrapper}>
          <span className={styles.statusIcon} role="img" aria-label="health icon">🛡️</span>
        </div>
        <p className={styles.statusText}>Safe & Healthy</p>
      </div>
      <div className={styles.healthStatusDetails}>
        <h2 className={styles.healthStatusTitle}>
          {userType === UserRole.Parent ? "Your Child's Health Status" : "Your Health Status"}
        </h2>
        <p className={styles.healthCheckupInfo}>
          Last health checkup: <span className={styles.checkupDate}>{lastCheckupDate}</span>
        </p>
        <p className={styles.healthDescription}>
          All vital signs are normal, and no issues were reported. Our school
          medical team is constantly monitoring the well-being of all students.
        </p>
      </div>
      <div className={styles.healthStatusActions}>
        <button className={`button ${styles.buttonViewReport}`}>
          <span className={styles.iconPlaceholder} role="img" aria-label="report">📄</span>
          View Health Report
        </button>
        <button className={`button ${styles.buttonMessageNurse}`}>
          <span className={styles.iconPlaceholder} role="img" aria-label="message">💬</span>
          Message Nurse
        </button>
      </div>
    </section>
    );
}

export default HealthStatus;