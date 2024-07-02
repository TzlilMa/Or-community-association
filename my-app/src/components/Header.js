// src/components/Header.js
import React, { useState, useEffect } from 'react';
import { db, doc, getDoc } from '../fireBase/firebase';
import logo from '../assets/logo.jpg';
import InstagramLogo from '../assets/brand-instagram.png';
import FacebookLogo from '../assets/brand-facebook.png';
import userLogo from '../assets/user.png';
import logoutLogo from '../assets/logout.png';
import { useNavigate } from 'react-router-dom';
import { auth } from '../fireBase/firebase';
import { useAuth } from '../fireBase/AuthContext';
import '../styles/Header.css';

const Header = ({ isAdmin }) => {
  const [firstName, setFirstName] = useState(null);
  const { currentUser } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        if (!currentUser || !currentUser.email) {
          console.error('User or email is not provided.');
          return;
        }

        console.log('Fetching user data for email:', currentUser.email); // Debug log

        const userDoc = await getDoc(doc(db, 'users', currentUser.email));
        if (userDoc.exists()) {
          const userData = userDoc.data();
          console.log('User data:', userData); // Debug log
          setFirstName(userData.firstName);
        } else {
          console.error('User document does not exist for email:', currentUser.email);
        }
      } catch (error) {
        console.error('Error fetching user data:', error);
      }
    };

    fetchUserData();
  }, [currentUser]);

  const handleComponentClick = (componentName) => {
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
      <div className="right-section">
        <div className="logo-container" onClick={handleLogoClick} style={{ cursor: 'pointer' }}>
          <img src={logo} alt="Logo" className="logo-image" />
        </div>
      </div>
      {currentUser && (
        <>
          <div className="center-section">
            <button className="nav-btn" onClick={() => handleComponentClick('Inquiry')}>מערכת פניות</button>
            <button className="nav-btn" onClick={() => handleComponentClick('Stories')}>סיפורים</button>
            <button className="nav-btn" onClick={() => handleComponentClick('Calendar')}>אירועים</button>
            <button className="nav-btn" onClick={() => handleComponentClick('Documents')}>טפסים ומידע</button>
            {isAdmin && (
              <button className="nav-btn" onClick={() => handleComponentClick('Reports')}>דוחות</button>
            )}
          </div>
          <div className="left-section">
            <div className="social-icons">
              <a href="https://www.facebook.com/share/46HcXMT56FM73K8j/?mibextid=K35XfP" target="_blank" rel="noopener noreferrer">
                <img src={FacebookLogo} alt="Facebook" className="header-icon" />
              </a>
              <a href="https://www.instagram.com/kheilator?igsh=N2U5bThhYXJ5aHhs" target="_blank" rel="noopener noreferrer">
                <img src={InstagramLogo} alt="Instagram" className="header-icon" />
              </a>
            </div>
            <div className="greeting">
              <img src={userLogo} alt="personal area" className="header-icon" onClick={() => handleComponentClick('personalArea')} />
              <p>שלום {firstName}</p>
            </div>
            <img src={logoutLogo} alt="exit" className="header-icon" onClick={handleSignOut} />
          </div>
        </>
      )}
    </header>
  );
};

export default Header;
