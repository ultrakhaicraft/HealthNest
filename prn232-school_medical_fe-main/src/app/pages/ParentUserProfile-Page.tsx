import React, { useState, useEffect, useCallback } from 'react';
import {
    IconUser
} from '../../components/IconList';
import ProfileHeader from '../../components/User_Profile/ProfileHeader';
import StudentInfo from '../../components/User_Profile/StudentInfo';
import PersonalInfo from '../../components/User_Profile/PersonalInfo';
import { AccountDetail, accountService, AccountUpdateData } from '../../feature/API/AccountService';
import '../CSS/UserProfile.css'
import { Link, useNavigate } from 'react-router-dom';
import { useAccountDetail } from '../../feature/Hooks/Account/useAccountDetail';
import { useUserId, useUserRole } from '../../feature/Hooks/Account/AccountHooks';

export interface IPersonalInfo {
    fullName: string,
    email: string,
    phone: string,
    address: string,
}

// --- User Profile Page Component ---
export default function ParentUserProfile() {
    const navigate = useNavigate();
    const {accountDetail,isStudentExist} = useAccountDetail();
    const [role, setRole] = useState('');
    const [updatedPersonalInfo, setUpdatedPersonalInfo] = useState<AccountUpdateData | null>(null)
    const [isEditMode, setIsEditMode] = useState(false);
    const AccountDetail= useAccountDetail();


    const [formData, setFormData] = useState<IPersonalInfo>({
        fullName: '',
        email: '',
        phone: '',
        address: '',
    });


    useEffect(() => {
        if (accountDetail) {
            setFormData({
                fullName: accountDetail.fullName,
                email: accountDetail.email,
                phone: accountDetail.phoneNumber,
                address: accountDetail.address,
            });
        }
    }, []);

    //This is where we call update API
    const handleAccountUpdate = async (PersonalInfo: IPersonalInfo) => {

        const storedRole = useUserRole() as AccountUpdateData['role'] | null;
        const storedId = useUserId()

        const newPersonalInfo: AccountUpdateData = {
            fullName: PersonalInfo.fullName,
            email: PersonalInfo.email,
            phoneNumber: PersonalInfo.phone,
            role: storedRole ?? '',
            address: PersonalInfo.address,
            parentId: storedId ?? ''
        }

        const userId = accountDetail?.id ?? "Empty ID";
        console.log(`Performing Update with ID: ${userId} `);
        console.log(newPersonalInfo);

        await accountService.update(userId, newPersonalInfo);

        const updatedDetail = await accountService.getDetailById(userId);

        // Step 3: Update localStorage and state
        localStorage.setItem('accountDetail', JSON.stringify(updatedDetail));
        //setAccountDetail(updatedDetail);

        // Step 4: Exit edit mode
        setIsEditMode(false);
    };





    return (
        <div className="container">
            <Link className='back-link' to="/parentHomepage">
                Return
            </Link>
            <header className="page-header">
                <IconUser className='icon' /> User Profile
            </header>

            <ProfileHeader
                name={accountDetail?.fullName ?? ""}
                parentOf={accountDetail?.studentName ?? ""}
                memberSince='7/2/2025'
                avatarUrl='/assets/PRN_Avatar.svg'
            />

            <div className="profile-content-grid">
                {accountDetail && (<PersonalInfo account={accountDetail} onUpdate={handleAccountUpdate}
                    isEditMode={isEditMode} setIsEditMode={setIsEditMode} formData={formData} setFormData={setFormData} />)}
                <StudentInfo studentName={accountDetail?.studentName ?? ""} studentId={accountDetail?.studentId ?? ""} />
            </div>
        </div>
    );
};













