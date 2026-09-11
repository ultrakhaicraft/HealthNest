import Footer from '../../../components/Landing_Page/footer';
import '../../CSS/Parent/ParentHomepage.css'; // Importing the CSS for the parent homepage
import '../../CSS/Parent/ParentStudentNavBar.css'
import { UserRole } from '../../../feature/Constant';
import { Outlet, useLocation, useNavigate } from 'react-router-dom';
import { getActiveItemFromPath, userouteForLabel } from '../../../feature/Hooks/Other/RouterHooks';
import ParentHomeNavBar from '../../../components/ParentStudentHomepage/ParentHomeNavBar';


// This component represents the parent container page for other components.
export default function ParentContainerPage() {
    const userType = UserRole.Parent;
    const navigate = useNavigate();
    const location = useLocation();

    // Derive the active nav item from the URL instead of local state
    const activeItem = getActiveItemFromPath(location.pathname, userType);

    const handleSelect = (label: string) => {
        navigate(userouteForLabel(label,userType)); // e.g. 'Medicine' -> '/nurseHomepage/medicines'
    };

    return (
        <div className="normal-page">
            <ParentHomeNavBar
                activeItem={activeItem}
                onSelect={handleSelect}
            />
            <div className="main-content">
                <Outlet />
            </div>
            <Footer />
        </div>

    );
}




