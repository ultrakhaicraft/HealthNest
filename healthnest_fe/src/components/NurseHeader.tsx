import { useEffect, useRef, useState } from "react";
import styles from "../CSS/Nurse/NurseTopHeader.module.css"
import { useNavigate } from "react-router-dom";
import avatarImage from "../../public/DefaultUserPfp.jpg"; // Import the avatar image

interface NurseHeaderProps {
  username: string;
  role: string;
  onSelect: (label: string) => void;

}

export const NurseHeader = ({ username, role, onSelect }: NurseHeaderProps) => {
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.clear();
    navigate('/login');
  };

  return (
    <header className={styles.nurseHeader}>
      <div className={styles.nurseHeaderSearch}>
        <svg className={styles.searchIcon} width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
          <circle cx="11" cy="11" r="8" />
          <line x1="21" y1="21" x2="16.65" y2="16.65" />
        </svg>
        <input type="text" placeholder="Type to search..." className={styles.searchInput} />
      </div>

      <div className={styles.nurseHeaderActions}>
        <button className={styles.iconButton} aria-label="Toggle theme">
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <circle cx="12" cy="12" r="5" />
            <line x1="12" y1="1" x2="12" y2="3" />
            <line x1="12" y1="21" x2="12" y2="23" />
            <line x1="4.22" y1="4.22" x2="5.64" y2="5.64" />
            <line x1="18.36" y1="18.36" x2="19.78" y2="19.78" />
            <line x1="1" y1="12" x2="3" y2="12" />
            <line x1="21" y1="12" x2="23" y2="12" />
            <line x1="4.22" y1="19.78" x2="5.64" y2="18.36" />
            <line x1="18.36" y1="5.64" x2="19.78" y2="4.22" />
          </svg>
        </button>

        <button className={styles.iconButton} aria-label="Notifications">
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <path d="M18 8a6 6 0 0 0-12 0c0 7-3 9-3 9h18s-3-2-3-9" />
            <path d="M13.73 21a2 2 0 0 1-3.46 0" />
          </svg>
          <span className={styles.notificationDot} />
        </button>

        <button className={styles.iconButton} aria-label="Messages">
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" />
          </svg>
          <span className={styles.notificationDot} />
        </button>

        <div className={styles.nurseHeaderDivider} />

        <NurseProfileDropdown handleLogout={handleLogout} onSelect={onSelect} username={username} role={role} />
      </div>
    </header>
  );
}

interface NurseProfileDropdownProps {
  handleLogout: () => void;
  onSelect: (item: string) => void;
  username: string;
  role: string;
}

const NurseProfileDropdown = ({
  handleLogout,
  onSelect,
  username,
  role,
}: NurseProfileDropdownProps) => {
  const [open, setOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);


  return (
    <div className={styles.nurseHeaderProfile} ref={dropdownRef}>
      <button
        type="button"
        className={styles.profileTrigger}
        onClick={() => setOpen((prev) => !prev)}
        aria-haspopup="menu"
        aria-expanded={open}
        aria-label={`Account menu for ${username}`}
      >
        <span className={styles.profileText}>
          <span className={styles.profileName}>{username}</span>
          <span className={styles.profileRole}>{role}</span>
        </span>
        <img className={styles.profileAvatar} src={avatarImage} alt={`Profile image for ${username}`} />
        <svg
          className={`${styles.dropdownChevron} ${open ? styles.dropdownChevronOpen : ''}`}
          width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"
          aria-hidden="true"
        >
          <polyline points="6 9 12 15 18 9" />
        </svg>
      </button>

      {open && (
        <div className={styles.dropdownMenu} role="menu">
          <button type="button" role="menuitem" className={styles.dropdownItem}
            onClick={() => onSelect('User Profile')}>
            👤 View Profile
          </button>
          <button type="button" role="menuitem"
            className={`${styles.dropdownItem} ${styles.dropdownItemLogout}`}
            onClick={handleLogout}>
            🚪 Logout
          </button>
        </div>
      )}
    </div>
  )
}