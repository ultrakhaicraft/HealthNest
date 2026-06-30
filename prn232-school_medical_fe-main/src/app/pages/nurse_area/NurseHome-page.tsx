import SideNav from '../../../components/StaffSideNav';
import { IconMedicine, IconIncidentReport, IconMedical } from '../../../components/IconList';
import { useState } from 'react';
import MedicineCRUDPage from './MedicineCRUD-page';
import '../../CSS/MedicineCRUD.css';
import IncidentRecordCRUDPage from './IncidentRecordCRUD-page';
import MedicineRequestCRUDPage from './MedicineRequestCRUD-page';

export default function NurseHomePage() {
    const [activeItem, setActiveItem] = useState('Home');

    let mainContent;
    if (activeItem === 'Home') {
        mainContent = (
            <div>
                <h1 style={{ fontSize: '2rem', fontWeight: 700, marginBottom: '2rem' }}>Welcome, Nurse!</h1>
                <div style={{ display: 'flex', gap: '2rem', flexWrap: 'wrap' }}>
                    <div
                        className="crud-container"
                        style={{ cursor: 'pointer', display: 'flex', flexDirection: 'column', alignItems: 'center' }}
                        onClick={() => setActiveItem('Medicine')}
                    >
                        <IconMedicine className="icon-large" />
                        <h2 style={{ margin: '1rem 0 0.5rem 0' }}>Manage Medicines</h2>
                        <p style={{ color: '#6b7280', textAlign: 'center' }}>View, add, edit, and remove medicines in the school inventory.</p>
                    </div>
                    <div
                        className="crud-container"
                        style={{ cursor: 'pointer', display: 'flex', flexDirection: 'column', alignItems: 'center' }}
                        onClick={() => setActiveItem('Medicine Request')}
                    >
                        <IconMedical className="icon-large" />
                        <h2 style={{ margin: '1rem 0 0.5rem 0' }}>Medicine Requests</h2>
                        <p style={{ color: '#6b7280', textAlign: 'center' }}>Review and manage medicine requests from parents.</p>
                    </div>
                    <div
                        className="crud-container"
                        style={{ cursor: 'pointer', display: 'flex', flexDirection: 'column', alignItems: 'center' }}
                        onClick={() => setActiveItem('Incident Report')}
                    >
                        <IconIncidentReport className="icon-large" />
                        <h2 style={{ margin: '1rem 0 0.5rem 0' }}>Manage Incident Records</h2>
                        <p style={{ color: '#6b7280', textAlign: 'center' }}>Log and review student incident records and reports.</p>
                    </div>
                </div>
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