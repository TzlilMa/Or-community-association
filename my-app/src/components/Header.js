// src/components/Header.js
import React from 'react';
import { auth } from '../fireBase/firebase';
import { useNavigate } from 'react-router-dom';
import Logo from './Logo'
import '../styles/Header.css'; // Import the CSS file for styling the header

const Header = ({ user }) => {
  const navigate = useNavigate();

  const handleLogout = async () => {
    try {
      await auth.signOut();
      navigate('/'); // Redirect to the login page after logout
    } catch (error) {
      console.error('Error logging out:', error);
    }
  };

  return (
    <header className="header">
      <div className="left-section">
        {user && <button id="exit" onClick={handleLogout}>התנתק</button>}
        {user && <p className="greeting">שלום {user.firstName}</p>}
      </div>
      
      {user && ( // Conditionally render the buttons if user is logged in
        <div className="center-section">
          <button id="chat-btn">לוח מודעות</button>
          <button id="chat-btn">צ'אט</button>
          <button id="stories-btn">סיפורים</button>
          <button id="events-btn">אירועים</button>
          <button id="conact-btn">צור קשר</button>
          <button id="personal-area-btn">האזור האישי</button>
        </div>
      )}
      <div className="right-section">
        <Logo />
      </div>
    </header>
  );
};

export default Header;