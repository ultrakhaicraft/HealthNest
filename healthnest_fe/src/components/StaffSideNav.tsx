import { useAuth } from "../feature/API/LoginService";
import { IconHealthCheckup, IconHome, IconIncidentReport, IconMedical, IconMedicine, IconStudentRecord, IconVaccine } from "./IconList";
import styles from '../CSS/Nurse/NurseNavBar.module.css';

interface SideNavProps {
  activeItem: string;
  onSelect: (label: string) => void;
}

const NurseSideNav = ({ activeItem, onSelect }: SideNavProps) => {
  const navItems = [
    { icon: <IconHome className="icon-small" />, label: 'Home' },
    { icon: <IconMedical className="icon-small" />, label: 'Medical Supply' },
    { icon: <IconMedicine className="icon-small" />, label: 'Medicine' },
    { icon: <IconMedical className="icon-small" />, label: 'Medicine Request' },
    { icon: <IconStudentRecord className="icon-small" />, label: 'Student Record' },
    { icon: <IconIncidentReport className="icon-small" />, label: 'Incident Report' },
    { icon: <IconVaccine className="icon-small" />, label: 'Vaccine' },
    { icon: <IconHealthCheckup className="icon-small" />, label: 'Health Checkup' },
    
  ];

 const { logout } = useAuth();

  return (
    <aside className={styles.nurseSideNav}>
      <div className="logo-container">
        <div className="logo-icon">
          <svg xmlns="http://www.w3.org/2000/svg" className="icon-large" viewBox="0 0 24 24" fill="currentColor"><path d="M12 2L14.47 8.53L21.5 9.53L16.5 14.24L17.94 21.02L12 17.77L6.06 21.02L7.5 14.24L2.5 9.53L9.53 8.53L12 2Z" /></svg>
        </div>
        <h1 className="logo-title">Starlight Academy</h1>
      </div>
      <nav>
        <ul>
          {navItems.map(item => (
            <li key={item.label}>
              <button
                type="button"
                className={activeItem === item.label ?
                   `${styles.navItem} ${styles.active} ${styles.navItemButton}` : `${styles.navItem} ${styles.navItemButton}`}
                onClick={() => onSelect(item.label)}
              >
                {item.icon}
                <span>{item.label}</span>
              </button>
            </li>
          ))}
          <li>
            <button
              type="button"
              className={`${styles.navItem} ${styles.navItemButton}`}
              onClick={logout}
            >
              <IconHome className="icon-small" />
              <span>Logout</span>
            </button>
          </li>
        </ul>
      </nav>
    </aside>
  );
}

export default NurseSideNav