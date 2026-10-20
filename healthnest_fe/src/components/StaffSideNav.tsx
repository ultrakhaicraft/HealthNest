import { useAuth } from "../feature/API/LoginService";
import { IconHealthCheckup, IconHome, IconIncidentReport, IconLogout, IconMedical, IconMedicine, IconStudentRecord, IconVaccine } from "./IconList";
import styles from '../CSS/Nurse/NurseNavBar.module.css';
import { Children, ReactNode, useEffect, useRef, useState } from "react";

interface SideNavProps {
  activeItem: string;
  onSelect: (label: string) => void;
}

interface NavItem {
  label: string;
  icon: ReactNode;
  children?: NavItem[]; // secondary menu, shown to the right of this item
}


const NurseSideNav = ({ activeItem, onSelect }: SideNavProps) => {
  const navItems = [
    { icon: <IconHome className={styles.iconSmall} />, label: 'Home' },
    { icon: <IconMedical className={styles.iconSmall} />, label: 'Medical Supply' },
    { icon: <IconMedicine className={styles.iconSmall} />, label: 'Medicine' },
    { icon: <IconMedical className={styles.iconSmall} />, label: 'Medicine Request' },
    {
      icon: <IconStudentRecord className={styles.iconSmall} />, label: 'Student Health Record',
      children: [
        { icon: <IconVaccine className={styles.iconSmall} />, label: 'Vaccine Record' },
        { icon: <IconMedical className={styles.iconSmall} />, label: 'Treatment Record' },
      ]
    },
    { icon: <IconIncidentReport className={styles.iconSmall} />, label: 'Incident Report' },
    { icon: <IconVaccine className={styles.iconSmall} />, label: 'Vaccine' },
    { icon: <IconHealthCheckup className={styles.iconSmall} />, label: 'Health Checkup' },


  ];

  const { logout } = useAuth();
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

  const handleSelect = (label: string) => {
    setOpenSubMenu  (null);
    onSelect(label);
  };

  const itemClass = (isActive: boolean) =>
    [styles.navItem, styles.navItemButton, isActive ? styles.active : ''].filter(Boolean).join(' ');


  return (
    <aside className={styles.nurseSideNav}>
      <div className={styles.logoContainer}>

        <svg xmlns="http://www.w3.org/2000/svg" className={styles.menuIcon} viewBox="0 0 24 24" fill="currentColor">
          {/*Use Menu Icon*/}
          <path d="M12 2L14.47 8.53L21.5 9.53L16.5 14.24L17.94 21.02L12 17.77L6.06 21.02L7.5 14.24L2.5 9.53L9.53 8.53L12 2Z" />
        </svg>

        <span className={styles.logoTitle}>HealthNest</span>
      </div>


      <nav className={styles.sideNavContent}>
        <ul>
          {navItems.map(item => {
            const hasChildren = !!item.children?.length;
            // Parent stays highlighted while one of its children is the current page
            const isActive =
              activeItem === item.label || !!item.children?.some((c) => c.label === activeItem);
            const isOpen = openSubMenu === item.label;
            return (
              <li key={item.label}
              className={[
                  hasChildren ? styles.hasSubmenu : '',
                  isOpen ? styles.submenuOpen : '',
                ].filter(Boolean).join(' ')}>
                <button
                  type="button"
                  className={itemClass(isActive)}
                  onClick={() => onSelect(item.label)}
                >
                  {item.icon}
                  <span>{item.label}</span>
                </button>

                {hasChildren && (
                  <ul className={styles.submenu} aria-label={`${item.label} submenu`}>
                    {item.children!.map((child) => (
                      <li key={child.label}>
                        <button
                          type="button"
                          className={itemClass(activeItem === child.label)}
                          onClick={() => handleSelect(child.label)}
                        >
                          {child.icon}
                          <span>{child.label}</span>
                        </button>
                      </li>
                    ))}
                  </ul>
                )}
              </li>
            );
          })}
          <li>
            <button
              type="button"
              className={`${styles.navItem} ${styles.navItemButton}`}
              onClick={logout}
            >
              <IconLogout className={styles.iconSmall} />
              <span>Logout</span>
            </button>
          </li>
        </ul>
      </nav>
    </aside>
  );
}

export default NurseSideNav