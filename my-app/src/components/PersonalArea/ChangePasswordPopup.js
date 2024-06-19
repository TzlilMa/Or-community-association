// src/components/PersonalArea/ChangePasswordPopup.js
import React, { useState } from 'react';
import { reauthenticateWithCredential, EmailAuthProvider, updatePassword } from 'firebase/auth';
import { auth } from '../../fireBase/firebase'; // Ensure the path is correct
import '../../styles/ChangePasswordPopup.css'; // Ensure the path is correct

const ChangePasswordPopup = ({ onClose }) => {
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmNewPassword, setConfirmNewPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [isPasswordTooShort, setIsPasswordTooShort] = useState(false);

  const MIN_PASSWORD_LENGTH = 6; // Minimum password length

  const handlePasswordChange = async () => {
    if (newPassword !== confirmNewPassword) {
      setError('הסיסמאות אינן תואמות');
      return;
    }

    if (newPassword.length < MIN_PASSWORD_LENGTH) {
      setError(`הסיסמה חייבת להיות באורך של לפחות ${MIN_PASSWORD_LENGTH} תווים`);
      return;
    }

    setLoading(true);

    try {
      const user = auth.currentUser;
      const credential = EmailAuthProvider.credential(user.email, currentPassword);

      // Reauthenticate user with current password
      await reauthenticateWithCredential(user, credential);

      // Update password
      await updatePassword(user, newPassword);

      setError('');
      onClose();
      alert('סיסמה שונתה בהצלחה');
    } catch (error) {
      console.error('Error changing password:', error);
      setError('אירעה שגיאה, בדוק את הסיסמה הנוכחית ונסה שוב');
    } finally {
      setLoading(false);
    }
  };

  const handleNewPasswordChange = (event) => {
    const { value } = event.target;
    setNewPassword(value);
    setIsPasswordTooShort(value.length < MIN_PASSWORD_LENGTH);
  };

  return (
    <div className="change-password-popup">
      <div className="popup-content">
        <h2>שנה סיסמה</h2>
        <label>
          סיסמה נוכחית:
          <input
            type="password"
            value={currentPassword}
            onChange={(e) => setCurrentPassword(e.target.value)}
          />
        </label>
        <label>
          סיסמה חדשה:
          <input
            type="password"
            value={newPassword}
            onChange={handleNewPasswordChange}
          />
        </label>
        {isPasswordTooShort && <p className="password-length-warning">קצר מידי</p>}
        <label>
          אשר סיסמה חדשה:
          <input
            type="password"
            value={confirmNewPassword}
            onChange={(e) => setConfirmNewPassword(e.target.value)}
          />
        </label>
        {error && <p className="error">{error}</p>}
        <button onClick={handlePasswordChange} disabled={loading}>שנה סיסמה</button>
        <button onClick={onClose}>ביטול</button>
      </div>
    </div>
  );
};

export default ChangePasswordPopup;
