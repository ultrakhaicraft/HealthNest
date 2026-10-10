import styles from "../../CSS/Parent/ParentHomePageNavBar.module.css"
import { ProfileDropdown, UserHomeNavBarProps } from "./ParentHomeNavBar";


const studentNavItems = [
  { label: 'Home' },
  { label: 'My Health Record' },
];

export default function StudentHomeNavBar({ activeItem, onSelect }: UserHomeNavBarProps) {
  return (
    <header className={styles.header}>
      <div className={styles.headerContainer}>
        <div className={styles.logo}>HealthNest</div>
        <nav className={styles.nav}>
          <ul>
            {studentNavItems.map(item => (
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
        <ProfileDropdown onSelect={onSelect} />
      </div>
    </header>
  );
}