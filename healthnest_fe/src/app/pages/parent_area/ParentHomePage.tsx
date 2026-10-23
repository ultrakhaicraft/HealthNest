import { useOutletContext } from "react-router-dom";
import HealthStatus from "../../../components/ParentStudentHomepage/health-status-box";
import HealthAnnouncements from "../../../components/ParentStudentHomepage/news-box";
import WelcomeBox from "../../../components/ParentStudentHomepage/welcome-box";
import { ParentOutletContext } from "./ParentContainerPage";
import styles from '../../../CSS/Parent/ParentHomepage.module.css'
import { useAccountDetailModel } from "../../../feature/Hooks/Account/useAccountDetail";
import DefaultAvatar from '../../../../public/DefaultUserPfp.jpg';
import { UserRole } from "../../../feature/Constant";
import { CardStudentView } from "../../../components/ParentStudentHomepage/CardStudentView";
import { useParentStudents } from "../../../feature/Hooks/Account/useStudentParent";





// Act as first thing to show when parent login, it will show the welcome box, health status and health announcement
// Kinda like a dashboard for parent, but not really a dashboard, just a homepage for parent
export default function ParentHomePage() {
    const { AccountDetailModel: accountDetail, error: accountError } = useAccountDetailModel(UserRole.Parent);
    const { students, loading: studentsLoading, error: studentsError } =
        useParentStudents(accountDetail?.id);
    const { userType } = useOutletContext<ParentOutletContext>();


    return (
        <>
            <WelcomeBox
                userType={userType}
                name={accountDetail?.fullName}
                avatarSrc={DefaultAvatar}
            />

            {/* Add a section that show a list of student in a small square card, with an emphasis on current health status
            Up to 3 cards. Below the cards, add a button that direct to student manage page for parent */}

            <CardStudentView
                students={students}
                loading={studentsLoading}
                error={accountError ?? studentsError}
            />

            <HealthAnnouncements />
        </>
    )
}

