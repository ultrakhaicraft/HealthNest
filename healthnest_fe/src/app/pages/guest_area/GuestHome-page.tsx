
import Footer from '../../../components/Landing_Page/footer';
import HomepageNavBar from '../../../components/Landing_Page/homepage-nav-bar'; 
import SchoolHomePageImage from '../../../../src/assets/images/SchoolHomePage.jpg'; // Import the image
import styles from "../../../CSS/Guest/GuestHomePage.module.css"

function Homepage() {
  return (
    <div className="main-page-container">
      {/* Header */}
      <HomepageNavBar />

      {/* Hero Section */}
      <section className={styles.hero}>
        <div className={styles.heroContainer}>
          <div className={styles.heroText}>
            <h1>Welcome to HealthNest</h1>
            <h2>Safe and sound school healthcare service</h2>
            <p>
              A special web application aims to improve the service of medical department in a school, Providing to care the student without effort.
            </p>
          </div>
          <div className={styles.heroImage}>        
            <img className={styles.imagePlaceholder} src={SchoolHomePageImage} alt="An Image of a school" />  
          </div>
        </div>
      </section>

      {/* About Section */}
      <section className={styles.about}>
        <div className={styles.aboutContainer}>
          <h3>About HealthNest Services</h3>
          <p>
            HealthNest offers user-friendly, quick and modern healthcare management service, with good feature such as including vaccination and regular health checkups news, medicine and medical supplies inventory tracking, and proactive student health monitoring. The service ensures that school medical staff can effectively use the system to improve how they can help their student with their medical attention.
          </p>
        </div>
      </section>

      {/* Services Section */}
      <section className={styles.services}>
        <h2>What Healthnest Offers</h2>
        <div className={styles.servicesGrid}>
          <div className={styles.serviceCard}>
            <div className={styles.icon}>💓</div>
            <h4>Student Health Monitoring</h4>
            <p>
              Enable Ongoing health tracking for student through recording incident in school, as well as managing their health record for future care.
            </p>
          </div>
          <div className={styles.serviceCard}>
            <div className={styles.icon}>🩺</div>
            <h4>Manage in house Medicine and Medical Supply</h4>
            <p>
              Track an inventory of medicine and medical for school medical staff, which helps organize and notify if an item need to be restocked before hand.
            </p>
          </div>
          <div className={styles.serviceCard}>
            <div className={styles.icon}>💉</div>
            <h4>Vaccine and Health Checkup Annoucement</h4>
            <p>
              Provide news related to latest vaccine and health checkup events for the student in school.
            </p>
          </div>
        </div>
      </section>

      {/* Footer */}
      <Footer />
    </div>
  );
}

export default Homepage;
