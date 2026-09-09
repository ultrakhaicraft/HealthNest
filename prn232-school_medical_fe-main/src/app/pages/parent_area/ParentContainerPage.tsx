import { useState } from 'react';
import Footer from '../../../components/Landing_Page/footer';
import UserHomepageNavBar from '../../../components/User_homepage/horizontal-nav-bar'; 
import '../../../app/CSS/Parent/ParentHomepage.css'; // Importing the CSS for the parent homepage
import { useAccountDetail } from '../../../feature/Hooks/Account/useAccountDetail';
import ParentHomePage from './ParentHomePage';
import ParentMedicineRequestCRUDPage from './ParentMedicineRequestCRUD-page';


// This component represents the parent container page for other components.
export default function ParentContainerPage() {
    //Call Get Account Detail from Service
    const { accountDetail, isStudentExist } = useAccountDetail();
    const userType = 'parent'; // Hardcoded user type for this page

    const [activeItem, setActiveItem] = useState('Home');

    
     let mainContent;
        if (activeItem === 'Home') {
            mainContent = (
                <ParentHomePage 
                    accountDetail={accountDetail}
                    isStudentExist={isStudentExist}
                    userType={userType}
                />
            );
        } else if (activeItem === 'Student Health Records') {
            mainContent = <MedicineCRUDPage />;
        } else if (activeItem === 'Incident Report') {
            mainContent = <IncidentRecordCRUDPage />;
        } else if (activeItem === 'Medicine Request') {
            mainContent = <ParentMedicineRequestCRUDPage />;
        } else {
            mainContent = <div style={{ padding: '2rem' }}>Feature coming soon.</div>;
        }
    

    return (
        <div className="normal-page">
            <UserHomepageNavBar
            userType={userType} 
            />
            <div className="main-content">
                {mainContent}
            </div>
            <Footer />
        </div>
        
    );
}




