// src/components/PasswordPrompt.js
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { auth, signInWithEmailAndPassword } from '../../fireBase/firebase';
import Notification from '../General/Notification';
import '../../styles/PasswordPrompt.css';

const PasswordPrompt = ({ onClose, redirectPath }) => {
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [showNotification, setShowNotification] = useState(false);
  const navigate = useNavigate();

  const handlePasswordChange = (e) => {
    setPassword(e.target.value);
  };

  const handlePasswordSubmit = async (e) => {
    e.preventDefault();
    const user = auth.currentUser;
    if (user) {
      try {
        await signInWithEmailAndPassword(auth, user.email, password);
        navigate(redirectPath);
      } catch (error) {
        setError('אין הרשאה');
        setShowNotification(true);
      }
    } else {
      setError('משתמש לא מורשה');
      setShowNotification(true);
    }
  };

  const handleCloseNotification = () => {
    setShowNotification(false);
  };

  return (
    <div className="password-prompt-overlay">
      <div className="password-prompt-modal">
        <h3>הקלד סיסמא</h3>
        <form onSubmit={handlePasswordSubmit}>
          <input
            type="password"
            value={password}
            onChange={handlePasswordChange}
            placeholder="סיסמא"
            required
          />
          <div className="button-group">
            <button type="submit">אישור</button>
            <button type="button" onClick={onClose}>סגור</button>
          </div>
        </form>
      </div>
      {showNotification && (
        <Notification message={error} type="error" onClose={handleCloseNotification} />
      )}
    </div>
  );
};

export default PasswordPrompt;
