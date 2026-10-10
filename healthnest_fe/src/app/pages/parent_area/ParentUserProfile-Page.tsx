import { useState, useEffect } from 'react';
import {IconUser} from '../../../components/IconList';
import ProfileHeader from '../../../components/User_Profile/ProfileHeader';
import StudentInfo from '../../../components/User_Profile/StudentInfo';
import PersonalInfo from '../../../components/User_Profile/PersonalInfo';
import { accountService } from '../../../feature/API/AccountService';
import { Link, useNavigate } from 'react-router-dom';
import { useUserId, useUserRole } from '../../../feature/Hooks/Account/AccountHooks';
import { AccountDetailModel, AccountUpdateRequest } from '../../../models/AccountModel';
import styles from '../../CSS/Components/UserProfile.module.css';
import { useAccountDetailModel } from '../../../feature/Hooks/Account/useAccountDetail';
import { ParentDetailModel, UpdateParentModel } from '../../../models/AccountSubclassModels/ParentModel';
import { StudentViewModel } from '../../../models/AccountSubclassModels/StudentModel';



// --- User Profile Page Component ---
export default function ParentUserProfile() {
    const navigate = useNavigate();
    const { AccountDetailModel: accountDetail, isStudentExist } = useAccountDetailModel();
    const [role, setRole] = useState('');
    const [updatedPersonalInfo, setUpdatedPersonalInfo] = useState<UpdateParentModel | null>(null)
    const [childList,setChildList] = useState<StudentViewModel[]>([]); //Load parent child list here
    const [isEditMode, setIsEditMode] = useState(false);


    const [formData, setFormData] = useState<ParentDetailModel>();

    //Load parent account detail and their childrens
    useEffect(() => {
        if (accountDetail) {
            setFormData({
                id: accountDetail.id,
                fullName: accountDetail.fullName ?? "N/A",
                email: accountDetail.email ?? "N/A",
                phoneNumber: accountDetail.phoneNumber ?? "N/A",
                address: accountDetail.address ?? "N/A",
                dateOfBirth: accountDetail.dateOfBirth ?? "N/A",
                accountCreationDateTime: accountDetail.accountCreationDateTime 
            });
        }
    }, []);

    //Update Parent User Profile
    const handleAccountUpdate = async (PersonalInfo: ParentDetailModel) => {

        const storedRole = useUserRole() as AccountUpdateRequest['role'] | null;
        const storedId = useUserId()

        const newPersonalInfo: AccountUpdateRequest = {
            fullName: PersonalInfo.fullName!,
            email: PersonalInfo.email!,
            phoneNumber: PersonalInfo.phoneNumber!,
            role: storedRole ?? '',
            address: PersonalInfo.address!,
            gender: PersonalInfo.gender!,
            avatarUrl: PersonalInfo.avatarUrl!,
            dateOfBirth: PersonalInfo.dateOfBirth
            
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
            <Link className={styles.backLink} to="/parentHomepage">
                Return
            </Link>
            <header className={styles.pageHeader}>
                <IconUser className='icon' /> User Profile
            </header>

            <ProfileHeader
                name={accountDetail?.fullName ?? ""}
                parentOf={accountDetail?.studentName ?? ""}
                memberSince='7/2/2025'
                avatarUrl='/assets/PRN_Avatar.svg'
            />

            <div className={styles.profileContentGrid}>
                {accountDetail && (<PersonalInfo account={accountDetail} onUpdate={handleAccountUpdate}
                    isEditMode={isEditMode} setIsEditMode={setIsEditMode} formData={formData} setFormData={setFormData} />)}
                <StudentInfo studentName={accountDetail?.studentName ?? ""} studentId={accountDetail?.studentId ?? ""} />
            </div>
        </div>
    );
};













