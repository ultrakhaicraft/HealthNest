import SideNav from '../../../components/StaffSideNav';
import { useState } from 'react';
import MedicineCRUDPage from './MedicineCRUD-page';
import IncidentRecordCRUDPage from './IncidentRecordCRUD-page';
import MedicineRequestCRUDPage from './MedicineRequestCRUD-page';
import { NurseDashboard } from './NurseDashboard-page';

import '../../CSS/Nurse/NurseTopHeader.css';
import '../../CSS/Nurse/NurseSideNav.css';
import MedicalSupplyCRUDPage from './MedicalSupplyCRUD-page';
import { useUserName } from '../../../feature/Hooks/Account/AccountHooks';
import { NurseHeader } from '../../../components/NurseHeader';

//A Container component for Nurse Home Page, which includes the Side Navigation and the main content area. 
//The main content area changes based on the selected item in the side navigation.
export default function NurseHomePage() {
    const [activeItem, setActiveItem] = useState('Home');

    // Function to get user full name from localStorage
    const username = useUserName();

    let mainContent;
    if (activeItem === 'Home') {
        mainContent = (
            <NurseDashboard username={username} /> 
        );
    } else if (activeItem === 'Medicine') {
        mainContent = <MedicineCRUDPage />;
    } else if (activeItem === 'Incident Report') {
        mainContent = <IncidentRecordCRUDPage />;
    } else if (activeItem === 'Medicine Request') {
        mainContent = <MedicineRequestCRUDPage />;
    } else if (activeItem === 'Medical Supplies') {
        mainContent = <MedicalSupplyCRUDPage />;
    } else {
        mainContent = <div style={{ padding: '2rem' }}>Feature coming soon.</div>;
    }

    return (
        <div style={{ display: 'flex', minHeight: '100vh' }}>
            <SideNav activeItem={activeItem} onSelect={setActiveItem} />           
              <div style={{ flex: 1,padding: '2rem', backgroundColor: '#e8effa' }}>
                <NurseHeader username={username} role="Nurse" />
                {mainContent}
              </div>
            
        </div>
    );
}


