import { useState, useEffect } from 'react';
import { IconBack, IconUser } from '../../../components/IconList';
import ProfileHeader from '../../../components/User_Profile/ProfileHeader';
import StudentInfo from '../../../components/User_Profile/StudentInfo';
import PersonalInfo from '../../../components/User_Profile/PersonalInfo';
import { accountService } from '../../../feature/API/AccountService';
import { Link } from 'react-router-dom';
import styles from '../../../CSS/Components/UserProfile.module.css';
import { useAccountDetailModel } from '../../../feature/Hooks/Account/useAccountDetail';
import { ParentDetailModel, UpdateParentModel } from '../../../models/AccountSubclassModels/ParentModel';
import DefaultPfp from '../../../../public/DefaultUserPfp.jpg';
import { UserRole } from '../../../feature/Constant';
import { useParentStudents } from '../../../feature/Hooks/Account/useStudentParent';

// --- User Profile Page Component ---
export default function ParentUserProfile() {

    const { AccountDetailModel: accountDetail, error: accountError, refetch: refetchAccount } = useAccountDetailModel(UserRole.Parent);
    const { students, loading: studentsLoading, error: studentsError } =
        useParentStudents(accountDetail?.id);

    //Update Parent User Profile
    const handleAccountUpdate = async (parentInfo: ParentDetailModel) => {
        const newPersonalInfo: UpdateParentModel = {
            fullName: parentInfo.fullName!,
            email: parentInfo.email!,
            phoneNumber: parentInfo.phoneNumber!,
            role: parentInfo.role,
            address: parentInfo.address!,
            gender: parentInfo.gender!,
            avatarUrl: parentInfo.avatarUrl!,
            dateOfBirth: parentInfo.dateOfBirth,
            incomeLevel: parentInfo.incomeLevel!,
            relationshipStatus: parentInfo.relationshipStatus!
        };

        await accountService.update(parentInfo.id, newPersonalInfo);
        await refetchAccount();
    };




    return (
        <div className={styles.container}   >
            <header className={styles.pageHeader}>
                {/*Turn into a back arrow*/}
                <Link className={styles.backLink} to="/parent" aria-label="Back to home" title="Back to home">
                    <IconBack className={styles.backIcon} />
                </Link>
                <IconUser className={styles.icon} /> User Profile
            </header>

            {accountError && <p className={styles.errorText}>{accountError}</p>}


            <ProfileHeader
                name={accountDetail?.fullName ?? ""}
                memberSince='7/2/2025'
                avatarUrl={DefaultPfp}
            />

            <div className={styles.profileContentGrid}>
                {accountDetail && (
                    <PersonalInfo account={accountDetail} onUpdate={handleAccountUpdate} />
                )}
                <StudentInfo students={students} loading={studentsLoading} error={studentsError} />
            </div>
        </div>
    );
};













