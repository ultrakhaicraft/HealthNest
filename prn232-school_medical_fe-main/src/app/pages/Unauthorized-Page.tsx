import { useLocation } from "react-router-dom";
import { useUserRole } from "../../feature/Hooks/AccountHooks";



export default function UnauthorizedPage() {
    const location = useLocation();
    const { allowedRoles, attemptedRole } = location.state ?? {};
    //const userRole = useUserRole();

    return(
        <div>
            <h1>Unauthorized Access</h1>
            {allowedRoles ? (
                <p>This page requires one of: {allowedRoles.join(', ')}. Your role: {attemptedRole ?? 'none'}.</p>
            ) : (
                <p>You don't have access to this page.</p>
            )}
            <button onClick={() => window.location.href = '/'}>Back to Home</button>
        </div>
    )
}