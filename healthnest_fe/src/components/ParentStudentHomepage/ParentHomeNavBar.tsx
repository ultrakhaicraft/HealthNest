import { useState, useRef, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import styles from "../../CSS/Parent/ParentHomePageNavBar.module.css";
import { userouteForLabel } from "../../feature/Hooks/Other/RouterHooks";
import { UserRole } from "../../feature/Constant";
import DefaultAvatar from "../../../public/DefaultUserPfp.jpg";
import { IconChevronDown } from "../IconList";


interface ParentNavItems {
  label: string;
  children?: ParentNavItems[]; // secondary menu, shown to the right of this item
}

export interface UserHomeNavBarProps {
  activeItem: string;
  onSelect: (label: string) => void;
  username: string;
}

//TODO: create a dropdown Menu for Even --> Vaccine Event and Health Checkup Event
const parentNavItems: ParentNavItems[] = [
  { label: 'Home' },
  { label: 'Student' },
  { label: 'Student Health Record' },
  { label: 'Medicine Request' },
  {
    label: 'Event',
    children: [
      { label: 'Health Checkup Event' },
      { label: 'Vaccine Event' }
    ]
  },

];

export default function ParentHomeNavBar({ activeItem, onSelect, username }: UserHomeNavBarProps) {
  const [openSubMenu, setOpenSubMenu] = useState<string | null>(null); // for touch / keyboard
  const navRef = useRef<HTMLElement>(null);

  useEffect(() => {
    const onMouseDown = (e: MouseEvent) => {
      if (navRef.current && !navRef.current.contains(e.target as Node)) setOpenSubMenu(null);
    };
    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') setOpenSubMenu(null);
    };
    document.addEventListener('mousedown', onMouseDown);
    document.addEventListener('keydown', onKeyDown);
    return () => {
      document.removeEventListener('mousedown', onMouseDown);
      document.removeEventListener('keydown', onKeyDown);
    };
  }, []);

  const handleSubMenuSelect = (label: string) => {
    setOpenSubMenu(null);
    onSelect(label);
  };

  const itemClass = (isActive: boolean) =>
    [styles.navItem, styles.navItemButton, isActive ? styles.active : ''].filter(Boolean).join(' ');

  return (
    <header className={styles.header}>
      <div className={styles.headerContainer}>
        <div className={styles.logo}>HealthNest</div>
        <nav className={styles.nav} ref={navRef}>
          <ul>
            {parentNavItems.map(item => {
              const hasChildren = !!item.children?.length;
              const isOpen = openSubMenu === item.label;
              return (
                <li key={item.label}
                  className={[
                    hasChildren ? styles.hasSubmenu : '',
                    isOpen ? styles.submenuOpen : '',
                  ].filter(Boolean).join(' ')}>
                  <button
                    type="button"
                    className={activeItem === item.label ? `${styles.navItem} ${styles.active}` : styles.navItem}
                    aria-haspopup={hasChildren ? 'menu' : undefined}
                    aria-expanded={hasChildren ? isOpen : undefined}
                    onClick={() => {
                      if (hasChildren) {
                        setOpenSubMenu((current) => current === item.label ? null : item.label);
                        return;
                      }
                      onSelect(item.label);
                    }}
                  >
                    <span>{item.label}</span>
                  </button>

                  {hasChildren && (
                    <ul className={styles.submenu} aria-label={`${item.label} submenu`}>
                      {item.children!.map((child) => (
                        <li key={child.label}>
                          <button
                            type="button"
                            className={itemClass(activeItem === child.label)}
                            onClick={() => handleSubMenuSelect(child.label)}
                          >
                            <span>{child.label}</span>
                          </button>
                        </li>
                      ))}
                    </ul>
                  )}
                </li>)
            }

            )}
          </ul>
        </nav>
        <ProfileDropdown  username={username} />
      </div>
    </header>
  );
}

interface ProfileDropdown {
  username: string;
}

export const ProfileDropdown = ({ username }: ProfileDropdown) => {
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
    navigate(userouteForLabel('User Profile', UserRole.Parent));
  };

  const handleLogout = () => {
    localStorage.clear();
    navigate('/login');
  };

  return (
    <div className={styles.profileDropdownContainer} ref={dropdownRef}>
      <button
        type="button"
        className={styles.profileTrigger}
        onClick={() => setOpen((prev) => !prev)}
        aria-haspopup="menu"
        aria-expanded={open}
        aria-label="Account menu"
      >
        <span className={styles.profileText}>
          <span className={styles.profileName}>{username}</span>
          <span className={styles.profileRole}>Parent</span>
        </span>
        <img className={styles.profileAvatar} src={DefaultAvatar} alt="" />
        <IconChevronDown className={`${styles.chevron} ${open ? styles.chevronOpen : ''}`} />
      </button>
      {open && (
        <div className={styles.dropdownMenu}>
          <button onClick={handleNavigateProfile} className={styles.dropdownItem}>👤 View Profile</button>
          <button onClick={handleLogout} className={`${styles.dropdownItem} ${styles.dropdownItemLogout}`}>🚪 Logout</button>
        </div>
      )}
    </div>
  );
};