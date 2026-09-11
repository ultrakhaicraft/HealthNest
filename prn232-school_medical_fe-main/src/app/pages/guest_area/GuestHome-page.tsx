
import Footer from '../../../components/Landing_Page/footer';
import HomepageNavBar from '../../../components/Landing_Page/homepage-nav-bar'; 
import '../../../app/CSS/Guest/GuestHomepage.css'
import SchoolHomePageImage from '../../../../src/assets/images/SchoolHomePage.jpg'; // Import the image

function Homepage() {
  return (
    <div className="normal-page">
      {/* Header */}
      <HomepageNavBar />

      {/* Hero Section */}
      <section className="hero">
        <div className="hero-container">
          <div className="hero-text">
            <h1>Welcome to HealthNest</h1>
            <h2>Safe and sound school healthcare service</h2>
            <p>
              A special web application aims to improve the service of medical department in a school, Providing to care the student without effort.
            </p>
          </div>
          <div className="hero-image">        
            <img className="image-placeholder" src={SchoolHomePageImage} alt="An Image of a school" />  
          </div>
        </div>
      </section>

      {/* About Section */}
      <section className="about">
        <div className="about-container">
          <h3>About HealthNest Services</h3>
          <p>
            HealthNest offers user-friendly, quick and modern healthcare management service, with good feature such as including vaccination and regular health checkups news, medicine and medical supplies inventory tracking, and proactive student health monitoring. The service ensures that school medical staff can effectively use the system to improve how they can help their student with their medical attention.
          </p>
        </div>
      </section>

      {/* Services Section */}
      <section className="services">
        <h2>What Healthnest Offers</h2>
        <div className="services-grid">
          <div className="service-card">
            <div className="icon">💓</div>
            <h4>Student Health Monitoring</h4>
            <p>
              Enable Ongoing health tracking for student through recording incident in school, as well as managing their health record for future care.
            </p>
          </div>
          <div className="service-card">
            <div className="icon">🩺</div>
            <h4>Manage in house Medicine and Medical Supply</h4>
            <p>
              Track an inventory of medicine and medical for school medical staff, which helps organize and notify if an item need to be restocked before hand.
            </p>
          </div>
          <div className="service-card">
            <div className="icon">💉</div>
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
