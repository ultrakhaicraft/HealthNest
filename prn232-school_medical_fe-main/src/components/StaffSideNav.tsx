import { IconHealthCheckup, IconHome, IconIncidentReport, IconMedical, IconMedicine, IconStudentRecord, IconVaccine } from "./IconList";

interface SideNavProps {
  activeItem: string;
  onSelect: (label: string) => void;
}

const SideNav = ({ activeItem, onSelect }: SideNavProps) => {
  const navItems = [
    { icon: <IconHome className="icon-small" />, label: 'Home' },
    { icon: <IconStudentRecord className="icon-small" />, label: 'Student Record' },
    { icon: <IconMedicine className="icon-small" />, label: 'Medicine' },
    { icon: <IconMedical className="icon-small" />, label: 'Medicine Request' },
    { icon: <IconIncidentReport className="icon-small" />, label: 'Incident Report' },
    { icon: <IconVaccine className="icon-small" />, label: 'Vaccine' },
    { icon: <IconHealthCheckup className="icon-small" />, label: 'Health Checkup' },
  ];

  return (
    <aside className="side-nav">
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
                className={activeItem === item.label ? 'nav-item active' : 'nav-item'}
                onClick={() => onSelect(item.label)}
                style={{ background: 'none', border: 'none', width: '100%', textAlign: 'left', padding: 0 }}
              >
                {item.icon}
                <span>{item.label}</span>
              </button>
            </li>
          ))}
        </ul>
      </nav>
    </aside>
  );
}

export default SideNav