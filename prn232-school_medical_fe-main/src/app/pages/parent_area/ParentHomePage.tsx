import HealthStatus from "../../../components/ParentStudentHomepage/health-status-box";
import HealthAnnouncements from "../../../components/ParentStudentHomepage/news-box";
import WelcomeBox from "../../../components/ParentStudentHomepage/welcome-box";
import { useAccountDetail } from "../../../feature/Hooks/Account/useAccountDetail";

interface ParentHomePageProps {
    isStudentExist: boolean;
    userType: string;
  }


// Act as first thing to show when parent login, it will show the welcome box, health status and health announcement
// Kinda like a dashboard for parent, but not really a dashboard, just a homepage for parent
export default function ParentHomePage({isStudentExist, userType }: ParentHomePageProps){
    const {accountDetail} = useAccountDetail();

    return(
        <>
            <WelcomeBox
            userType={userType}
            name={accountDetail?.fullName}
            childName={accountDetail?.studentName}
            avatarSrc="/assets/PRN_Avatar.svg" 
             />

            {!isStudentExist && <NoStudentAlertBox/> }

            <HealthStatus
            userType={userType}
            lastCheckupDate="March 15, 2024" />
            
            <HealthAnnouncements />     
        </>
    )
}


function NoStudentAlertBox(){

    return(
        <div className='box-warning welcome-card'>
                <p>!!! You don't have student assigned, please head over your profile to assign your student !!!</p>
        </div>
    );
}