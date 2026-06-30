
import Footer from '../../../components/Landing_Page/footer';
import HomepageNavBar from '../../../components/Landing_Page/homepage-nav-bar'; 
import '../../../app/CSS/GuestHomepage.css'

function Homepage() {
  return (
    <div className="normal-page">
      {/* Header */}
      <HomepageNavBar />

      {/* Hero Section */}
      <section className="hero">
        <div className="hero-container">
          <div className="hero-text">
            <h1>Welcome to Starlight Academy</h1>
            <h2>Empowering Minds, Nurturing Health</h2>
            <p>
              At Starlight Academy, we believe in fostering academic excellence and holistic well-being for every student. Our dedicated medical services ensure that health and safety are at the heart of our thriving school community.
            </p>
          </div>
          <div className="hero-image">
            <div className="image-placeholder">[School Image Placeholder]</div>
          </div>
        </div>
      </section>

      {/* About Section */}
      <section className="about">
        <div className="about-container">
          <h3>About Our School & Medical Services</h3>
          <p>
            Starlight Academy offers a nurturing learning environment, focusing on the academic, emotional, and physical well-being of every student. Our on-campus medical team provides comprehensive healthcare support, including vaccination programs, regular health checkups, and proactive student health monitoring. With modern facilities and a compassionate staff, we ensure our students feel safe, healthy, and ready to achieve their best.
          </p>
        </div>
      </section>

      {/* Services Section */}
      <section className="services">
        <h2>School Medical Services</h2>
        <div className="services-grid">
          <div className="service-card">
            <div className="icon">💉</div>
            <h4>Vaccination</h4>
            <p>
              Comprehensive vaccination drives to protect students from preventable diseases, conducted in a safe and supportive environment.
            </p>
          </div>
          <div className="service-card">
            <div className="icon">🩺</div>
            <h4>Health Checkup</h4>
            <p>
              Regular health checkups by certified medical professionals to monitor and maintain students’ overall health and well-being.
            </p>
          </div>
          <div className="service-card">
            <div className="icon">💓</div>
            <h4>Student Health Monitoring</h4>
            <p>
              Ongoing health tracking and support for every student to ensure a safe, nurturing, and responsive school environment.
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
