// src/components/Header.js
import React, { useState, useEffect } from 'react';
import logo from '../assets/logo.jpg';
import InstagramLogo from '../assets/brand-instagram.png';
import FacebookLogo from '../assets/brand-facebook.png';
import { useNavigate } from 'react-router-dom';
import { auth } from '../fireBase/firebase';
import '../styles/Header.css';

const Header = () => {
  const [user, setUser] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged((user) => {
      setUser(user);
    });

    // Cleanup subscription on unmount
    return () => unsubscribe();
  }, []);

  const handleComponentClick = (componentName) => {
    if (componentName === 'Calendar') {
      navigate('/calendar');
    } else if (componentName === 'NoticeBoard') {
      navigate('/notice-board');
    } else if (componentName === 'Chat') {
      navigate('/chat');
    } else if (componentName === 'Stories') {
      navigate('/stories');
    } else if (componentName === 'Documents') {
      navigate('/documents');
    }
  };

  const handleSignOut = () => {
    auth.signOut().then(() => {
      navigate('/login'); // Redirect to the login page after signing out
    }).catch((error) => {
      console.error('Error signing out:', error);
    });
  };

  const handleLogoClick = () => {
    navigate('/');
  };

  return (
    <header className="header">
      <div className="right-section">
        <div className="logo-container" onClick={handleLogoClick} style={{ cursor: 'pointer' }}>
          <img src={logo} alt="Logo" className="logo-image" />
        </div>
      </div>
      {user && (
        <>
        <div className="center-section">
            <button className="nav-btn" onClick={() => handleComponentClick('NoticeBoard')}>לוח מודעות</button>
            <button className="nav-btn" onClick={() => handleComponentClick('Chat')}>צ'אט</button>
            <button className="nav-btn" onClick={() => handleComponentClick('Stories')}>סיפורים</button>
            <button className="nav-btn" onClick={() => handleComponentClick('Calendar')}>אירועים</button>
            <button className="nav-btn" onClick={() => handleComponentClick('Documents')}>מסמכים</button>
          </div>
          
          <div className="left-section">
            <div className="social-icons">
              <a href="https://www.facebook.com/share/46HcXMT56FM73K8j/?mibextid=K35XfP" target="_blank" rel="noopener noreferrer">
                <img src={FacebookLogo} alt="Facebook" className="social-logo" />
              </a>
              <a href="https://www.instagram.com/kheilator?igsh=N2U5bThhYXJ5aHhs" target="_blank" rel="noopener noreferrer">
                <img src={InstagramLogo} alt="Instagram" className="social-logo" />
              </a>
            </div>
            <p className="greeting">שלום {user.email}</p>
            <button className="nav-btn sign-out-btn" onClick={handleSignOut}>התנתק</button>
          </div>
        </>
      )}
    </header>
  );
};

export default Header;