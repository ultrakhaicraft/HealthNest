import { IconCalendar, IconChild } from "../IconList";

interface ProfileHeaderProps{
    name:string;
    parentOf:string;
    memberSince: string;
    avatarUrl: string;
}


const ProfileHeader = ({ name, parentOf, memberSince, avatarUrl }:ProfileHeaderProps) => (
    <div className="profile-header-card">
        <img src={avatarUrl} alt="User Avatar" className="profile-header-avatar" />
        <div className="profile-header-info">
            <h1>{name}</h1>
            <div className="profile-header-meta">
                <div className="meta-item">
                    <IconChild className="icon" /> Parent of: <strong>{parentOf}</strong>
                </div>
                <div className="meta-item">
                    <IconCalendar className="icon" /> Member since: {memberSince}
                </div>
            </div>
        </div>
    </div>
);

export default ProfileHeader;