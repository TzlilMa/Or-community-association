import React from 'react';
import { auth } from '../fireBase/firebase';
import { useNavigate } from 'react-router-dom';
import logo from '../assets/logo.jpeg';
import InstagramLogo from '../assets/brand-instagram.png';
import FacebookLogo from '../assets/brand-facebook.png';
import '../styles/Header.css';

const Header = ({ user, onComponentChange }) => {
  const navigate = useNavigate();

  const handleLogout = async () => {
    try {
      await auth.signOut();
      navigate('/');
    } catch (error) {
      console.error('Error logging out:', error);
    }
  };

  const handleComponentClick = (componentName) => {
    onComponentChange(componentName);
  };

  // Function to handle logo click
  const handleLogoClick = () => {
    if (user) {
      // If user is logged in, navigate to homepage
      handleComponentClick('ContentLayout');
    } else {
      // If user is not logged in, navigate to login page
      navigate('/login');
    }
  };

  return (
    <header className="header">
      <div className="left-section">
        <div className="social-icons">
          <a href="https://www.facebook.com/share/46HcXMT56FM73K8j/?mibextid=K35XfP" target="_blank" rel="noopener noreferrer">
            <img src={FacebookLogo} alt="Facebook" className="social-logo" />
          </a>
          <a href="https://www.instagram.com/kheilator?igsh=N2U5bThhYXJ5aHhs" target="_blank" rel="noopener noreferrer">
            <img src={InstagramLogo} alt="Instagram" className="social-logo" />
          </a>
        </div>
        {user && (
          <>
            <p className="greeting">שלום {user.firstName}</p>
            <button className="logout-btn" onClick={handleLogout}>התנתק</button>
          </>
        )}
      </div>
      
      <div className="center-section">
        {user && (
          <>
            <button className="nav-btn" onClick={() => handleComponentClick('Chat')}>לוח מודעות</button>
            <button className="nav-btn" onClick={() => handleComponentClick('Notices')}>צ'אט</button>
            <button className="nav-btn" onClick={() => handleComponentClick('Stories')}>סיפורים</button>
            <button className="nav-btn" onClick={() => handleComponentClick('Calendar')}>אירועים</button>
            <button className="nav-btn" onClick={() => handleComponentClick('Contact')}>צור קשר</button>
            <button className="nav-btn" onClick={() => handleComponentClick('PersonalArea')}>האזור האישי</button>
          </>
        )}
      </div>

      <div className="right-section">
        <div className="logo-container">
          <img src={logo} alt="Logo" className="logo-image" onClick={handleLogoClick} />
        </div>
      </div>
    </header>
  );
};

export default Header;
