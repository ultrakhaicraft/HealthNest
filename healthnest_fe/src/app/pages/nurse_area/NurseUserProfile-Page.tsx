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


// --- User Profile Page Component ---
export default function NurseUserProfile() {
    const navigate = useNavigate();
    const { AccountDetailModel: accountDetail, isStudentExist } = useAccountDetailModel();
    const [role, setRole] = useState('');
    const [updatedPersonalInfo, setUpdatedPersonalInfo] = useState<UpdateNurseModel | null>(null)
    const [isEditMode, setIsEditMode] = useState(false);


    const [formData, setFormData] = useState<NurseDetailModel>();

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
    const handleAccountUpdate = async (PersonalInfo: NurseDetailModel) => {

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
            <Link className={styles.backLink} to="/nurseHomepage">
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
            </div>
        </div>
    );
};

