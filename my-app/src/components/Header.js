import React from 'react';
import { auth } from '../fireBase/firebase';
import { useNavigate } from 'react-router-dom';
import Logo from './Logo';
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
    // Call the parent component's function to change the active component
    onComponentChange(componentName);
  };

  return (
    <header className="header">
      <div className="left-section">
        {user && <button id="exit" onClick={handleLogout}>התנתק</button>}
        {user && <p className="greeting">שלום {user.firstName}</p>}
      </div>
      
      {user && (
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
