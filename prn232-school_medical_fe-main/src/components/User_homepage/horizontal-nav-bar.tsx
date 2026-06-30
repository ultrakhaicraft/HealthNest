import { useState, useRef, useEffect } from "react";
import { useNavigate } from "react-router-dom";
interface UserHomeNavBarProps {
    userType: string;
}

export default function UserHomeNavBar({userType}: UserHomeNavBarProps) {

    let homeUrl: string='';
    switch (userType) {
      case 'parent':
        homeUrl='/parentHomepage'
        break;
      case 'student':
        homeUrl='/studentHomepage'
        break;
      default:
        break;
    }

    return (
        <header className="header">
        <div className="header-container">
          <div className="logo">🎓 Starlight Academy</div>
          <nav className="nav">
            <a href={homeUrl}>Home</a>
            {userType === 'parent' && <a href="/viewStudentHealthRecord">Student Health Record</a>}
            {userType === 'parent' && <a href="/requestMedicine">Request Medicine</a>}
            <a href="#">News</a>               
          </nav>
          <ProfileDropdown/>
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