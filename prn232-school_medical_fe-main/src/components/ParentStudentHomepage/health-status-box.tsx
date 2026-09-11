interface HealthStatusProps {
    lastCheckupDate: string;
    userType: string; // Optional prop for user type
}




function HealthStatus({lastCheckupDate, userType} : HealthStatusProps) {
    return(
        <section className="health-status-card">
      <div className="health-status-icon-area">
        {/* Replace with <img src="/assets/shield-heart-icon.svg" alt="Safe & Healthy" className="status-icon" /> */}
        <div className="status-icon-wrapper">
          <span className="status-icon" role="img" aria-label="health icon">🛡️</span>
        </div>
        <p className="status-text">Safe & Healthy</p>
      </div>
      <div className="health-status-details">
        {
          userType === 'parent' ? (
            <h2 className="health-status-title">Your Child's Health Status</h2>
          ) : (
            <h2 className="health-status-title">Your Health Status</h2>
          )
        }
        <p className="health-checkup-info">
          Last health checkup: <span className="checkup-date">{lastCheckupDate}</span>
        </p>
        <p className="health-description">
          All vital signs are normal, and no issues were reported. Our school
          medical team is constantly monitoring the well-being of all students.
        </p>
      </div>
      <div className="health-status-actions">
        <button className="button button-view-report">
          {/* Replace with <img src="/assets/report-icon.svg" alt="" className="button-icon" /> */}
          <span className="icon-placeholder" role="img" aria-label="report">📄</span>
          View Health Report
        </button>
        <button className="button button-message-nurse">
          {/* Replace with <img src="/assets/message-icon.svg" alt="" className="button-icon" /> */}
          <span className="icon-placeholder" role="img" aria-label="message">💬</span>
          Message Nurse
        </button>
      </div>
    </section>
    );
}

export default HealthStatus;