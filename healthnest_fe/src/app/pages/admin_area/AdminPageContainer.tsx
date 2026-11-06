import { Outlet, useLocation, useNavigate } from "react-router-dom";
import StaffSideNav from "../../../components/StaffSideNav";
import { UserRole } from "../../../feature/Constant";
import { getActiveItemFromPath, userouteForLabel } from "../../../feature/Hooks/Other/RouterHooks";


export default function AdminPageContainer() {

    const userRole = UserRole.Admin;
    const navigate = useNavigate();
    const location = useLocation();

    // Derive the active nav item from the URL instead of local state
    const activeItem = getActiveItemFromPath(location.pathname, userRole);

    const handleSelect = (label: string) => {
        navigate(userouteForLabel(label, userRole)); // e.g. 'Medicine' -> '/nurseHomepage/medicines'
    };


    return (
        <div style={{ display: 'flex', minHeight: '100vh' }}>
            <StaffSideNav activeItem={activeItem} onSelect={handleSelect} IsAdmin={userRole === UserRole.Admin} />
            <div className='main-page-container' style={{ flex: 1, padding: '2rem', backgroundColor: '#e8effa' }}>
                <Outlet /> {/* renders whichever nested route matched */}
            </div>

        </div>
    )
}