import { Link } from 'react-router-dom';



export default function HomepageNavBar() {
  return (
    <header className="header">
        <div className="header-container">
          <div className="logo">🎓 Starlight Academy</div>
          <nav className="nav">
            <a href="/">Home</a>
            <a href="/blogs">Blog</a>           
          </nav>
          <Link to="/login" className="login-button">Login</Link>
        </div>
    </header>
  );
}

