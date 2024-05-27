import React from 'react';
import { auth } from '../fireBase/firebase';
import { useNavigate } from 'react-router-dom';
import Logo from './Logo';
import InstagramLogo from '../assets/brand-instagram.png'; // Ensure the path is correct
import FacebookLogo from '../assets/brand-facebook.png'; // Ensure the path is correct
import '../styles/Header.css'; // Import the CSS file for styling the header

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
    // Call the parent component's function to change the active component
    onComponentChange(componentName);
  };

  return (
    <header className="header">
      <div className="left-section">
        {user && <button id="exit" onClick={handleLogout}>התנתק</button>}
        {user && <p className="greeting">שלום {user.firstName}</p>}
        <div className="social-icons">
          <a href="https://www.facebook.com/share/46HcXMT56FM73K8j/?mibextid=K35XfP" target="_blank" rel="noopener noreferrer">
            <img src={FacebookLogo} alt="Facebook" className="social-logo" />
          </a>
          <a href="https://www.instagram.com/kheilator?igsh=N2U5bThhYXJ5aHhs" target="_blank" rel="noopener noreferrer">
            <img src={InstagramLogo} alt="Instagram" className="social-logo" />
          </a>
        </div>
      </div>
      
      {user && ( // Conditionally render the buttons if user is logged in
        <div className="center-section">
          <button id="chat-btn" onClick={() => handleComponentClick('Chat')}>לוח מודעות</button>
          <button id="chat-btn" onClick={() => handleComponentClick('Notices')}>צ'אט</button>
          <button id="stories-btn">סיפורים</button>
          <button id="events-btn">אירועים</button>
          <button id="conact-btn">צור קשר</button>
          <button id="personal-area-btn" onClick={() => handleComponentClick('PersonalArea')}>האזור האישי</button>
        </div>
      )}

      <div className="right-section">
        <Logo />
      </div>
    </header>
  );
};

export default Header;
