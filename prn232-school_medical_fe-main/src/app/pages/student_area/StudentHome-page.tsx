
import React from 'react';
import Footer from '../../../components/Landing_Page/footer';
import UserHomepageNavBar from '../../../components/User_homepage/horizontal-nav-bar'; 
import WelcomeBox from '../../../components/User_homepage/welcome-box';
import HealthStatus from '../../../components/User_homepage/health-status-box';
import HealthAnnouncements from '../../../components/User_homepage/news-box';
import '../../CSS/ParentHomepage.css';

export default function StudentHomePage() {
    // This component represents the student homepage
    const userType = 'student'; // This can be dynamically set based on user authentication]

    return (
        <div className="normal-page">
            <UserHomepageNavBar
            userType={userType} />

            <WelcomeBox
            userType={userType}
            name="John Doe"
            childName="Jane Doe"
            avatarSrc="/assets/PRN_Avatar.svg" 
             />
            
            <HealthStatus
            userType={userType}
            lastCheckupDate="March 15, 2024" />
            <HealthAnnouncements />       
            <Footer />
        </div>
        
    );
}