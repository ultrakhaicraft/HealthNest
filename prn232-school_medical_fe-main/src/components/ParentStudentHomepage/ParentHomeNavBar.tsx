import { useState, useRef, useEffect } from "react";
import { useNavigate } from "react-router-dom";
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
    <header className="header">
      <div className="header-container">
        <div className="logo">🎓 Starlight Academy</div>
        <nav className="nav">
          <ul>
            {ParentnavItems.map(item => (
              <li key={item.label}>
                <button
                  type="button"
                  className={activeItem === item.label ? 'nav-item active' : 'nav-item'}
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
    <div className="profile-dropdown-container" ref={dropdownRef}>
      <img
        className="profile-avatar"
        src="./assets/PRN_Avatar.svg"
        alt="User profile"
        onClick={() => setOpen(prev => !prev)}
      />
      {open && (
        <div className="dropdown-menu">
          <button onClick={handleNavigateProfile} className="dropdown-item">👤 View Profile</button>
          <button onClick={handleLogout} className="dropdown-item logout">🚪 Logout</button>
        </div>
      )}
    </div>
  );
};