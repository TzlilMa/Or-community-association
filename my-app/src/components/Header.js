import React, { useState } from 'react';
import logo from '../assets/logo_with_text.jpeg';
import InstagramLogo from '../assets/brand-instagram.png';
import FacebookLogo from '../assets/brand-facebook.png';
import userLogo from '../assets/user.png';
import logoutLogo from '../assets/logout.png';
import chatIcon from '../assets/chat-icon.png';
import { useNavigate } from 'react-router-dom';
import { auth } from '../fireBase/firebase';
import { useAuth } from '../fireBase/AuthContext';
import { useUser } from '../UserContext';
import '../styles/Header.css';

const Header = ({ isAdmin }) => {
  const { user } = useUser(); // Use the UserContext
  const { currentUser } = useAuth();
  const navigate = useNavigate();
  const [menuOpen, setMenuOpen] = useState(false);

  const handleComponentClick = (componentName) => {
    setMenuOpen(false);
    if (componentName === 'Calendar') {
      navigate('/calendar');
    } else if (componentName === 'Inquiry') {
      if (isAdmin) {
        navigate('/admin-inquiries');
      } else {
        navigate('/inquiry');
      }
    } else if (componentName === 'Stories') {
      navigate('/stories');
    } else if (componentName === 'Reports') {
      navigate('/reports');
    } else if (componentName === 'Documents') {
      navigate('/documents');
    } else if (componentName === 'personalArea') {
      navigate('/profile');
    } else if (componentName === 'Chat') {
      navigate('/chat');
    }
  };

  const handleSignOut = () => {
    auth.signOut().then(() => {
      navigate('/login');
    }).catch((error) => {
      console.error('Error signing out:', error);
    });
  };

  const handleLogoClick = () => {
    navigate('/');
  };

  return (
    <header>
      <div className="logo-container" onClick={handleLogoClick} style={{ cursor: 'pointer' }}>
        <img src={logo} alt="Logo" className="logo-image" />
      </div>
      <div className={`center-section ${menuOpen ? 'open' : ''}`}>
        {currentUser && (
          <>
            <button className="nav-btn" onClick={() => handleComponentClick('Inquiry')}>מערכת פניות</button>
            <button className="nav-btn" onClick={() => handleComponentClick('Stories')}>סיפורים</button>
            <button className="nav-btn" onClick={() => handleComponentClick('Calendar')}>אירועים</button>
            <button className="nav-btn" onClick={() => handleComponentClick('Documents')}>טפסים ומידע</button>
            {isAdmin && (
              <button className="nav-btn" onClick={() => handleComponentClick('Reports')}>דוחות וניהול</button>
            )}
          </>
        )}
      </div>
      <div className="right-section">
        <div className="social-icons">
          <a href="https://www.facebook.com/share/46HcXMT56FM73K8j/?mibextid=K35XfP" target="_blank" rel="noopener noreferrer">
            <img src={FacebookLogo} alt="Facebook" className="header-icon" />
          </a>
          <a href="https://www.instagram.com/kheilator?igsh=N2U5bThhYXJ5aHhs" target="_blank" rel="noopener noreferrer">
            <img src={InstagramLogo} alt="Instagram" className="header-icon" />
          </a>
          <img src={chatIcon} alt="Chat" className="header-icon" onClick={() => handleComponentClick('Chat')}/>
        </div>
        <div className="greeting">
          <img src={userLogo} alt="personal area" className="header-icon" onClick={() => handleComponentClick('personalArea')} />
          <p>שלום {user.firstName}</p>
        </div>
        <img src={logoutLogo} alt="exit" className="header-icon logout-icon" onClick={handleSignOut} />
        <div className="hamburger-icon" onClick={() => setMenuOpen(!menuOpen)}>
          <span></span>
          <span></span>
          <span></span>
        </div>
      </div>
    </header>
  );
};

export default Header;
