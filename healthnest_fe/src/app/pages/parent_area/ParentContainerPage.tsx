import Footer from '../../../components/Landing_Page/footer';
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
        navigate(userouteForLabel(label,userType)); 
    };

    return (
        <div className="normal-page">
            <ParentHomeNavBar
                activeItem={activeItem}
                onSelect={handleSelect}
            />
            <div className="main-content">
                <Outlet context={{ userType } satisfies ParentOutletContext} />
            </div>
            <Footer />
        </div>

    );
}


export interface ParentOutletContext {
  userType: string; 
}

