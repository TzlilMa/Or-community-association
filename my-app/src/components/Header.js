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
import '../styles/Header.css';

const Header = ({isAdmin}) => {
  const [user, setUser] = useState(null);
  const [firstName, setFirstName] = useState(null);
  const navigate = useNavigate();
  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged((user) => {
      setUser(user);
    });

    // Cleanup subscription on unmount
    return () => unsubscribe();
  }, []);

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        if (!user || !user.email) {
          console.error('User or email is not provided.');
          return;
        }

        const userDoc = await getDoc(doc(db, 'users', user.email));
        if (userDoc.exists()) {
          const userData = userDoc.data();
          setFirstName(userData.firstName);
        } else {
          console.error('User document does not exist.');
        }
      } catch (error) {
        console.error('Error fetching user data:', error);
      }
    };

    fetchUserData();
  }, [user]);

  const handleComponentClick = (componentName) => {
    if (componentName === 'Calendar') {
      navigate('/calendar');
    } else if (componentName === 'NoticeBoard') {
        if (isAdmin) {
          navigate('/admin-inquiries');
        } else {
          navigate('/inquiry'); // Updated navigation to inquiry page
        }
    } else if (componentName === 'Stories') {
      navigate('/stories');
    } else if (componentName === 'Documents') {
      navigate('/documents');
    } else if (componentName === 'personalArea') {
      navigate('/profile');
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
    <header>
      <div className="right-section">
        <div className="logo-container" onClick={handleLogoClick} style={{ cursor: 'pointer' }}>
          <img src={logo} alt="Logo" className="logo-image" />
        </div>
      </div>
      {user && (
        <>
          <div className="center-section">
            <button className="nav-btn" onClick={() => handleComponentClick('NoticeBoard')}>מערכת פניות</button> {/* Updated text and click handler */}
            <button className="nav-btn" onClick={() => handleComponentClick('Stories')}>סיפורים</button>
            <button className="nav-btn" onClick={() => handleComponentClick('Calendar')}>אירועים</button>
            <button className="nav-btn" onClick={() => handleComponentClick('Documents')}>מסמכים</button>
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
