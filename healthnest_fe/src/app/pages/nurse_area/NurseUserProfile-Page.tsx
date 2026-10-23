import { useState, useEffect } from "react";
import { useNavigate, Link } from "react-router-dom";
import { IconUser } from "../../../components/IconList";
import PersonalInfo from "../../../components/User_Profile/PersonalInfo";
import ProfileHeader from "../../../components/User_Profile/ProfileHeader";
import { accountService } from "../../../feature/API/AccountService";
import { useUserRole, useUserId } from "../../../feature/Hooks/Account/AccountHooks";
import { useAccountDetailModel } from "../../../feature/Hooks/Account/useAccountDetail";
import { AccountUpdateRequest } from "../../../models/AccountModel";
import { UpdateNurseModel, NurseDetailModel } from "../../../models/AccountSubclassModels/NurseModel";
import styles from '../../CSS/Components/UserProfile.module.css';
import { UserRole } from "../../../feature/Constant";
import DefaultPfp from '../../../../public/DefaultUserPfp.jpg';


// --- User Profile Page Component ---
export default function NurseUserProfile() {
    const { AccountDetailModel: nurseDetail, error: accountError, refetch: refetchAccount } =
        useAccountDetailModel(UserRole.Nurse);


    //Update Parent User Profile
    const handleAccountUpdate = async (nurseInfo: NurseDetailModel) => {

        const newPersonalInfo: UpdateNurseModel = {
            fullName: nurseInfo.fullName!,
            email: nurseInfo.email!,
            phoneNumber: nurseInfo.phoneNumber!,
            role: nurseInfo.role ?? '',
            address: nurseInfo.address!,
            gender: nurseInfo.gender!,
            avatarUrl: nurseInfo.avatarUrl!,
            dateOfBirth: nurseInfo.dateOfBirth,
            description: nurseInfo.description!,

        }
        await accountService.update(nurseInfo.id, newPersonalInfo);
        await refetchAccount();

        return (
            <div className="container">
                <Link className={styles.backLink} to="/nurseHomepage">
                    Return
                </Link>
                <header className={styles.pageHeader}>
                    <IconUser className='icon' /> User Profile
                </header>

                <ProfileHeader
                    name={nurseDetail?.fullName ?? ""}
                    memberSince='7/2/2025'
                    avatarUrl={DefaultPfp}
                />

                <div className={styles.profileContentGrid}>
                    {nurseDetail && (<NursePersonalInfo account={nurseDetail} onUpdate={handleAccountUpdate} />)}
                </div>
            </div>
        );
    };
}

