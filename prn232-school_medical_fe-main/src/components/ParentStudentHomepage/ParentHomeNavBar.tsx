import { useState, useRef, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import styles from "../../app/CSS/Parent/ParentStudentNavBar.module.css"

interface UserHomeNavBarProps {
  activeItem: string;
  onSelect: (label: string) => void;
}

const ParentnavItems = [
  { label: 'Home' },
  { label: 'Student Health Record' },
  { label: 'Medicine Request' },
];

export default function ParentHomeNavBar({ activeItem, onSelect }: UserHomeNavBarProps) {
  return (
    <header className={styles.header}>
      <div className={styles.headerContainer}>
        <div className={styles.logo}>🎓 Starlight Academy</div>
        <nav className={styles.nav}>
          <ul>
            {ParentnavItems.map(item => (
              <li key={item.label}>
                <button
                  type="button"
                  className={activeItem === item.label ? `${styles.navItem} ${styles.active}` : styles.navItem}
                  onClick={() => onSelect(item.label)}
                >
                  <span>{item.label}</span>
                </button>
              </li>
            ))}
          </ul>
        </nav>
        <ProfileDropdown />
      </div>
    </header>
  );
}

const ProfileDropdown = () => {
  const [open, setOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const navigate = useNavigate();

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleNavigateProfile = () => {
    navigate('/parentUserProfile');
  };

  const handleLogout = () => {
    localStorage.clear();
    navigate('/login');
  };

  return (
    <div className={styles.profileDropdownContainer} ref={dropdownRef}>
      <img
        className={styles.profileAvatar}
        src="./assets/PRN_Avatar.svg"
        alt="User profile"
        onClick={() => setOpen(prev => !prev)}
      />
      {open && (
        <div className={styles.dropdownMenu}>
          <button onClick={handleNavigateProfile} className={styles.dropdownItem}>👤 View Profile</button>
          <button onClick={handleLogout} className={`${styles.dropdownItem} ${styles.dropdownItemLogout}`}>🚪 Logout</button>
        </div>
      )}
    </div>
  );
};