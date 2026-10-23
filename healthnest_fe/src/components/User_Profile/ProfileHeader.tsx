import { IconCalendar, IconChild } from "../IconList";
import styles from '../../CSS/Components/UserProfile.module.css';

interface ProfileHeaderProps{
    name:string;
    memberSince: string;
    avatarUrl: string;
}


const ProfileHeader = ({ name, memberSince, avatarUrl }:ProfileHeaderProps) => (
    <div className={styles.profileHeaderCard} >
        <img src={avatarUrl} alt="User Avatar" className={styles.profileHeaderAvatar} />
        <div className={styles.profileHeaderInfo}>
            <h1>{name}</h1>
            <div className={styles.profileHeaderMeta}>
                <div className={styles.metaItem}>
                    <IconChild className={styles.icon} />
                    <span><strong>Parent</strong></span>
                </div>
                <div className={styles.metaItem}>
                    <IconCalendar className={styles.icon} /> 
                    <span><strong> Member since: {memberSince} </strong></span>
                </div>
            </div>
        </div>
    </div>
);

export default ProfileHeader;