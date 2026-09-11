import NurseSideNav from '../../../components/StaffSideNav';
import '../../CSS/Nurse/NurseSideNav.css';
import '../../CSS/Nurse/NurseTopHeader.css';
import "../../CSS/Nurse/NurseCRUDPanel.css"
import { useUserName } from '../../../feature/Hooks/Account/AccountHooks';
import { NurseHeader } from '../../../components/NurseHeader';
import { useNavigate, useLocation, Outlet } from 'react-router-dom';
import { getActiveItemFromPath, userouteForLabel } from '../../../feature/Hooks/Other/RouterHooks';
import { UserRole } from '../../../feature/Constant';

//A Container component for Nurse Home Page, which includes the Side Navigation and the main content area. 
//The main content area changes based on the selected item in the side navigation.
export default function NurseHomePage() {
    // Function to get user full name from localStorage
    const userRole = UserRole.Nurse
    const username = useUserName();
    const navigate = useNavigate();
    const location = useLocation();

    // Derive the active nav item from the URL instead of local state
    const activeItem = getActiveItemFromPath(location.pathname,userRole);

    const handleSelect = (label: string) => {
        navigate(userouteForLabel(label,userRole)); // e.g. 'Medicine' -> '/nurseHomepage/medicines'
    };


    return (
        <div style={{ display: 'flex', minHeight: '100vh' }}>
            <NurseSideNav activeItem={activeItem} onSelect={handleSelect} />
            <div style={{ flex: 1, padding: '2rem', backgroundColor: '#e8effa' }}>
                <NurseHeader username={username} role="Nurse" />
                <Outlet /> {/* renders whichever nested route matched */}
            </div>

        </div>
    );
}

