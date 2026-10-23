import { UserRole } from "../../feature/Constant";
import styles from '../../CSS/Parent/ParentHomepage.module.css'

interface HealthStatusProps {
    lastCheckupDate: string;
    userType: string; // Optional prop for user type
}



//Consider now a Parent can own multiple children (Student), the component should be a dashboard of multiple child
//Health Status can be check via Incident Records available in the current time
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
        
        
      </div>
    </section>
    );
}

export default HealthStatus;