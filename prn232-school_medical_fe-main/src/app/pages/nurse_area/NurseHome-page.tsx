import SideNav from '../../../components/StaffSideNav';
import { useState } from 'react';
import MedicineCRUDPage from './MedicineCRUD-page';
import '../../CSS/MedicineCRUD.css';
import IncidentRecordCRUDPage from './IncidentRecordCRUD-page';
import MedicineRequestCRUDPage from './MedicineRequestCRUD-page';
import { NurseDashboard } from './NurseDashboard-page';

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
            <NurseDashboard username={getUserFullName()} /> 
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
              <div style={{ flex: 1,padding: '2rem', backgroundColor: '#e8effa' }}>
                <NurseHeader username={getUserFullName()} role="Nurse" />
                {mainContent}
              </div>
            
        </div>
    );
}


interface NurseHeaderProps {
  username: string;
  role: string;
}



const NurseHeader = ({ username, role }: NurseHeaderProps) => {
    return(
        <header className="nurse-header">
      <div className="nurse-header-search">
        <svg className="search-icon" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
          <circle cx="11" cy="11" r="8" />
          <line x1="21" y1="21" x2="16.65" y2="16.65" />
        </svg>
        <input type="text" placeholder="Type to search..." className="search-input" />
      </div>

      <div className="nurse-header-actions">
        <button className="icon-button" aria-label="Toggle theme">
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <circle cx="12" cy="12" r="5" />
            <line x1="12" y1="1" x2="12" y2="3" />
            <line x1="12" y1="21" x2="12" y2="23" />
            <line x1="4.22" y1="4.22" x2="5.64" y2="5.64" />
            <line x1="18.36" y1="18.36" x2="19.78" y2="19.78" />
            <line x1="1" y1="12" x2="3" y2="12" />
            <line x1="21" y1="12" x2="23" y2="12" />
            <line x1="4.22" y1="19.78" x2="5.64" y2="18.36" />
            <line x1="18.36" y1="5.64" x2="19.78" y2="4.22" />
          </svg>
        </button>

        <button className="icon-button" aria-label="Notifications">
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <path d="M18 8a6 6 0 0 0-12 0c0 7-3 9-3 9h18s-3-2-3-9" />
            <path d="M13.73 21a2 2 0 0 1-3.46 0" />
          </svg>
          <span className="notification-dot" />
        </button>

        <button className="icon-button" aria-label="Messages">
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" />
          </svg>
          <span className="notification-dot" />
        </button>

        <div className="nurse-header-divider" />

        <div className="nurse-header-profile">
          <div className="profile-text">
            <p className="profile-name">{username}</p>
            <p className="profile-role">{role}</p>
          </div>
          <div className="profile-avatar" />
          <svg className="dropdown-chevron" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <polyline points="6 9 12 15 18 9" />
          </svg>
        </div>
      </div>
    </header>
    )
}