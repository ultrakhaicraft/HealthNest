import { useOutletContext } from "react-router-dom";
import HealthStatus from "../../../components/ParentStudentHomepage/health-status-box";
import HealthAnnouncements from "../../../components/ParentStudentHomepage/news-box";
import WelcomeBox from "../../../components/ParentStudentHomepage/welcome-box";
import { ParentOutletContext } from "./ParentContainerPage";
import styles from '../../../CSS/Parent/ParentHomepage.module.css'
import { useAccountDetailModel } from "../../../feature/Hooks/Account/useAccountDetail";




// Act as first thing to show when parent login, it will show the welcome box, health status and health announcement
// Kinda like a dashboard for parent, but not really a dashboard, just a homepage for parent
export default function ParentHomePage(){
    const {AccountDetailModel: accountDetail,isStudentExist} = useAccountDetailModel();
    const {userType} = useOutletContext<ParentOutletContext>();


    return(
        <>
            <WelcomeBox
            userType={userType}
            name={accountDetail?.fullName}
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
        <div className={`${styles.boxWarning} ${styles.welcomeCard}`}>
                <p>!!! You don't have student assigned, please head over your profile to assign your student !!!</p>
        </div>
    );
}