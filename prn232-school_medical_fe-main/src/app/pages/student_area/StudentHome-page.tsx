
import React from 'react';
import Footer from '../../../components/Landing_Page/footer';
import UserHomepageNavBar from '../../../components/ParentStudentHomepage/ParentHomeNavBar'; 
import WelcomeBox from '../../../components/ParentStudentHomepage/welcome-box';
import HealthStatus from '../../../components/ParentStudentHomepage/health-status-box';
import HealthAnnouncements from '../../../components/ParentStudentHomepage/news-box';
import '../../CSS/ParentHomepage.css';

export default function StudentHomePage() {
    // This component represents the student homepage
    const userType = 'student'; // This can be dynamically set based on user authentication

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