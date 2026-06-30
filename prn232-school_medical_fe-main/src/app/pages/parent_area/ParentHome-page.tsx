import React, { useEffect, useState } from 'react';
import Footer from '../../../components/Landing_Page/footer';
import UserHomepageNavBar from '../../../components/User_homepage/horizontal-nav-bar'; 
import WelcomeBox from '../../../components/User_homepage/welcome-box';
import HealthStatus from '../../../components/User_homepage/health-status-box';
import HealthAnnouncements from '../../../components/User_homepage/news-box';
import '../../../app/CSS/ParentHomepage.css'; // Importing the CSS for the parent homepage
import { AccountDetail, accountService } from '../../../feature/API/AccountService';


function ParentHomepage() {
    // This component represents the parent homepage
    const userType = 'parent'; 

    //Call Get Account Detail from Service
    const [accountDetail, setAccountDetail]= useState<AccountDetail|null>(null); //Hold account detail
    const [isStudentExist, setIsStudentExist]= useState<boolean>(true);

    useEffect(()=>{
        const getAccountDetail = async ()=>{
            const userId = localStorage.getItem('userId');
            if (!userId) {
                console.warn('User ID not found in localStorage');
                return;
            }
            try{
                const result = await accountService.getDetailById(userId);

                console.log('Account detail fetched successfully:', result);
                
                const studentDetail = await accountService.getStudentFromParentId(result.id);

                if (studentDetail) {
                setIsStudentExist(true);
                result.studentId = studentDetail.id;
                result.studentName = studentDetail.fullName;
                } else {
                setIsStudentExist(false);
                result.studentId = "";
                result.studentName = "";
                }

                setAccountDetail(result);
                localStorage.setItem("accountDetail", JSON.stringify(result));
            }catch(error){
                console.error('Failed to fetch account details:', error)
            }
        };
        
        getAccountDetail();
    },[]);

    return (
        <div className="normal-page">
            <UserHomepageNavBar
            userType={userType} 
            />

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

            <Footer />
        </div>
        
    );
}

function NoStudentAlertBox(){

    return(
        <div className='box-warning welcome-card'>
                <p>!!! You don't have student assigned, please head over your profile to assign your student !!!</p>
        </div>
    );
}


export default ParentHomepage;