import { IconCalendar, IconChild } from "../IconList";
import styles from '../../CSS/Components/UserProfile.module.css';

interface ProfileHeaderProps{
    name:string;
    parentOf:string;
    memberSince: string;
    avatarUrl: string;
}


const ProfileHeader = ({ name, parentOf, memberSince, avatarUrl }:ProfileHeaderProps) => (
    <div className={styles.profileHeaderCard} >
        <img src={avatarUrl} alt="User Avatar" className={styles.profileHeaderAvatar} />
        <div className={styles.profileHeaderInfo}>
            <h1>{name}</h1>
            <div className={styles.profileHeaderMeta}>
                <div className={styles.metaItem}>
                    <IconChild className="icon" /> Parent of: <strong>{parentOf}</strong>
                </div>
                <div className={styles.metaItem}>
                    <IconCalendar className="icon" /> Member since: {memberSince}
                </div>
            </div>
        </div>
    </div>
);

export default ProfileHeader;