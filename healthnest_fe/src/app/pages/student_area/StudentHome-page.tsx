
import React from 'react';
import Footer from '../../../components/Landing_Page/footer';
import WelcomeBox from '../../../components/ParentStudentHomepage/welcome-box';
import HealthStatus from '../../../components/ParentStudentHomepage/health-status-box';
import HealthAnnouncements from '../../../components/ParentStudentHomepage/news-box';
import '../../CSS/ParentHomepage.css';
import { UserRole } from '../../../feature/Constant';
import { useNavigate, useLocation } from 'react-router-dom';
import { getActiveItemFromPath, userouteForLabel } from '../../../feature/Hooks/Other/RouterHooks';
import StudentHomeNavBar from '../../../components/ParentStudentHomepage/StudentHomeNavBar';

export default function StudentHomePage() {
    const userType = UserRole.Student; 
    const navigate = useNavigate();
    const location = useLocation();

    // Derive the active nav item from the URL instead of local state
    const activeItem = getActiveItemFromPath(location.pathname, userType);

    const handleSelect = (label: string) => {
        navigate(userouteForLabel(label,userType)); 
    };

    return (
        <div className="normal-page">
            <StudentHomeNavBar
                activeItem={activeItem}
                onSelect={handleSelect} 
            />

            <WelcomeBox
            userType={userType}
            name="John Doe"
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