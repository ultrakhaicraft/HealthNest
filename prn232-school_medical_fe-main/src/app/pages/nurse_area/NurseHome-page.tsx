import SideNav from '../../../components/StaffSideNav';
import { IconMedicine, IconIncidentReport, IconMedical } from '../../../components/IconList';
import { useState } from 'react';
import MedicineCRUDPage from './MedicineCRUD-page';
import '../../CSS/MedicineCRUD.css';
import IncidentRecordCRUDPage from './IncidentRecordCRUD-page';
import MedicineRequestCRUDPage from './MedicineRequestCRUD-page';

export default function NurseHomePage() {
    const [activeItem, setActiveItem] = useState('Home');

    // Function to get user full name from localStorage
    const getUserFullName = () => {
        const userName = localStorage.getItem('userName');
        console.log('Retrieved userName from localStorage:', userName);
        return userName || 'Nurse';
    };

    let mainContent;
    if (activeItem === 'Home') {
        mainContent = (
            <div>
                <h2>Welcome, {getUserFullName()}!</h2>
                <p>This is your personal dashboard.</p>
                <p>TODO: Active Incident Reports</p>
                <p>TODO: Active Medicine Requests</p>
                <p>TODO: Upcoming Vaccine Appointments</p>
            </div>
        );
    } else if (activeItem === 'Medicine') {
        mainContent = <MedicineCRUDPage />;
    } else if (activeItem === 'Incident Report') {
        mainContent = <IncidentRecordCRUDPage />;
    } else if (activeItem === 'Medicine Request') {
        mainContent = <MedicineRequestCRUDPage />;
    } else {
        mainContent = <div style={{ padding: '2rem' }}>Feature coming soon.</div>;
    }

    return (
        <div style={{ display: 'flex', minHeight: '100vh' }}>
            <SideNav activeItem={activeItem} onSelect={setActiveItem} />
            <div style={{ flex: 1, padding: '2rem' }}>
                {mainContent}
            </div>
        </div>
    );
}