import { Link } from "react-router-dom";
import { IconUser } from "../../../components/IconList";
import ProfileHeader from "../../../components/User_Profile/ProfileHeader";
import { accountService } from "../../../feature/API/AccountService";
import { useAccountDetailModel } from "../../../feature/Hooks/Account/useAccountDetail";
import { UpdateNurseModel, NurseDetailModel } from "../../../models/AccountSubclassModels/NurseModel";
import styles from '../../CSS/Components/UserProfile.module.css';
import { UserRole } from "../../../feature/Constant";
import DefaultPfp from '../../../../public/DefaultUserPfp.jpg';
import NursePersonalInfo from "../../../components/User_Profile/NursePersonalInfo";


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
                    name={nurseDetail?.fullName ?? ""}
                    memberSince='7/2/2025'
                    avatarUrl={DefaultPfp}
                />

                <div className={styles.profileContentGrid}>
                    {nurseDetail && (<NursePersonalInfo account={nurseDetail} onUpdate={handleAccountUpdate} />)}
                </div>
            </div>
        );
}

