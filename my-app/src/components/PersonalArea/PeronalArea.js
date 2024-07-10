import React, { useEffect, useState } from 'react';
import { db, doc, getDoc, setDoc, auth } from '../../fireBase/firebase'; // Adjust the import path as needed
import { reauthenticateWithCredential, EmailAuthProvider, updatePassword } from 'firebase/auth';
import Notification from '../General/Notification';
import ReactQuill from 'react-quill';
import 'react-quill/dist/quill.snow.css'; // Import styles
import '../../styles/PersonalArea.css'; // Ensure this path is correct

const PersonalArea = () => {
  const [userData, setUserData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    personalStory: '',
    isStoryPublic: false,
    gender: '',
  });
  const [loading, setLoading] = useState(true);
  const [storyLength, setStoryLength] = useState(0);
  const [passwordData, setPasswordData] = useState({
    currentPassword: '',
    newPassword: '',
    confirmPassword: '',
  });
  const [passwordError, setPasswordError] = useState('');
  const [isPasswordTooShort, setIsPasswordTooShort] = useState(false);
  const [notification, setNotification] = useState({ message: '', type: '' });

  const MIN_PASSWORD_LENGTH = 6; // Minimum password length
  const MIN_STORY_LENGTH = 100; // Minimum story length
  const MAX_CHARS = 5000; // Maximum story length

  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged((user) => {
      if (user) {
        const fetchUserData = async () => {
          try {
            const userDoc = await getDoc(doc(db, 'users', user.email));
            if (userDoc.exists()) {
              const userDataFromDB = userDoc.data();
              setUserData(userDataFromDB);
              setStoryLength(userDataFromDB.personalStory.length);
            } else {
              console.error('User document does not exist.');
            }
          } catch (error) {
            console.error('Error fetching user data:', error);
          } finally {
            setLoading(false);
          }
        };
        fetchUserData();
      } else {
        console.log('No user is signed in.');
        setLoading(false);
      }
    });

    return () => unsubscribe();
  }, []);

  const handleInputChange = (event) => {
    const { name, value } = event.target;

    setUserData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  const handleStoryChange = (value) => {
    if (value.length <= MAX_CHARS) {
      setStoryLength(value.length);
      setUserData((prevData) => ({
        ...prevData,
        personalStory: value,
      }));
    }
  };

  const handleCheckboxChange = (event) => {
    setUserData((prevData) => ({
      ...prevData,
      isStoryPublic: event.target.checked,
    }));
  };

  const handlePasswordChangeInput = (event) => {
    const { name, value } = event.target;
    setPasswordData((prevData) => ({
      ...prevData,
      [name]: value,
    }));

    if (name === 'newPassword') {
      setIsPasswordTooShort(value.length < MIN_PASSWORD_LENGTH);
    }
  };

  const handleFormDetailsSubmit = async (event) => {
    event.preventDefault();
  
    if (!userData.firstName.trim() || !userData.lastName.trim()) {
      setNotification({ message: 'שם פרטי ושם משפחה הינם שדות חובה', type: 'error' });
      return;
    }
  
    const currentUserData = await getDoc(doc(db, 'users', auth.currentUser.email));
    const currentUserDataFromDB = currentUserData.exists() ? currentUserData.data() : null;
  
    if (
      currentUserDataFromDB &&
      currentUserDataFromDB.firstName === userData.firstName &&
      currentUserDataFromDB.lastName === userData.lastName &&
      currentUserDataFromDB.personalStory === userData.personalStory &&
      currentUserDataFromDB.isStoryPublic === userData.isStoryPublic
    ) {
      setNotification({ message: 'לא בוצעו שינויים', type: 'success' });
      return;
    }
  
    const updatedUserData = { ...userData };
    delete updatedUserData.email; // Remove email from the data being updated
  
    try {
      await setDoc(doc(db, 'users', auth.currentUser.email), updatedUserData, { merge: true });
      setNotification({ message: 'הנתונים נשמרו בהצלחה', type: 'success' });
    } catch (error) {
      console.error('Error updating user data:', error);
      setNotification({ message: 'אירעה שגיאה בעדכון נתונים, אנא נסה שוב מאוחר יותר', type: 'error' });
    }
  };

  const handleChangePersonalStory = async () => {
    if (userData.personalStory.length < MIN_STORY_LENGTH) {
      setNotification({ message: `הסיפור חייב להיות באורך של לפחות ${MIN_STORY_LENGTH} תווים`, type: 'error' });
      return;
    }
    
    try {
      await setDoc(doc(db, 'users', auth.currentUser.email), userData, { merge: true });
      setNotification({ message: 'הסיפור נשמר בהצלחה', type: 'success' });
    } catch (error) {
      console.error('Error updating personal story:', error);
      setNotification({ message: 'אירעה שגיאה בעדכון הסיפור, אנא נסה שוב מאוחר יותר', type: 'error' });
    }
  };

  const handleChangePassword = async () => {
    if (passwordData.newPassword !== passwordData.confirmPassword) {
      setPasswordError('הסיסמאות אינן תואמות');
      return;
    }

    if (passwordData.newPassword.length < MIN_PASSWORD_LENGTH) {
      setPasswordError(`הסיסמה חייבת להיות באורך של לפחות ${MIN_PASSWORD_LENGTH} תווים`);
      return;
    }

    try {
      const user = auth.currentUser;
      const credential = EmailAuthProvider.credential(user.email, passwordData.currentPassword);

      // Reauthenticate user with current password
      await reauthenticateWithCredential(user, credential);

      // Update password
      await updatePassword(user, passwordData.newPassword);

      setPasswordError('');
      setNotification({ message: 'סיסמא שונתה בהצלחה', type: 'success' });
      setPasswordData({
        currentPassword: '',
        newPassword: '',
        confirmPassword: '',
      });
    } catch (error) {
      console.error('Error changing password:', error);
      setPasswordError('אירעה שגיאה, בדוק את הסיסמה הנוכחית ונסה שוב');
    }
  };

  if (loading) {
    return <div>Loading...</div>;
  }

  return (
    <div className="personal-area-container">
      <div className="personal-area">
        <h1>{userData.firstName}, איזה כיף {userData.gender === 'male' ? 'שאתה פה' : 'שאת פה'}!</h1>
        <h3>הינה הפרטים שלך כפי שהם מעודכנים במערכת</h3>
        <form onSubmit={handleFormDetailsSubmit} className="personal-area-form">
          <label className="form-label">
            שם פרטי:
            <input
              type="text"
              name="firstName"
              value={userData.firstName}
              onChange={handleInputChange}
              className="input"
            />
          </label>
          <label className="form-label">
            שם משפחה:
            <input
              type="text"
              name="lastName"
              value={userData.lastName}
              onChange={handleInputChange}
              className="input"
            />
          </label>
          <label className="form-label">
            כתובת מייל:
            <input
              type="email"
              name="email"
              value={userData.email}
              readOnly
              className="input read-only"
            />
          </label>
          <div className="btns-personal-area">
            <button type="submit" className="submit-btn">שמור</button>
          </div>
        </form>
      </div>
      <div className="personal-story-section">
        <h2>הסיפור שלי</h2>
        <p>
          קהילת אור מאפשרת לחברי הקהילה לשתף את הסיפור האישי שלהם. כאן זה המקום לעשות זאת!
        </p>
        <ReactQuill
          value={userData.personalStory}
          onChange={handleStoryChange}
          className="story-textarea"
          modules={{
            toolbar: [
              ['bold', 'italic', 'link']
            ],
          }}
          formats={[
            'bold', 'italic', 'blockquote', 'link'
          ]}
          dir="rtl"
          placeholder='הקלד כאן את הסיפור שלך...'
        />
        <div className="story-footer">
          <p>{storyLength}/{MAX_CHARS}</p>
          <label className="checkbox-label">
            <input
              type="checkbox"
              name="isStoryPublic"
              checked={userData.isStoryPublic}
              onChange={handleCheckboxChange}
              className="checkbox-input"
            />
            אני מאשר/ת שהסיפור שלי ישותף עם חברי הקהילה
          </label>
        </div>
        <div className='btns-personal-area'>
          <button type="submit" className="submit-btn" onClick={handleChangePersonalStory}>שמור</button>
        </div>
      </div>
      <div className="change-password-section">
        <h2>שנה סיסמה</h2>
        <label className="form-label">
          סיסמה נוכחית:
          <input
            type="password"
            name="currentPassword"
            value={passwordData.currentPassword}
            onChange={handlePasswordChangeInput}
            className="input"
          />
        </label>
        <label className="form-label">
          סיסמה חדשה:
          <input
            type="password"
            name="newPassword"
            value={passwordData.newPassword}
            onChange={handlePasswordChangeInput}
            className="input"
          />
        </label>
        {isPasswordTooShort && <p className="password-length-warning">קצר מידי</p>}
        <label className="form-label">
          אשר סיסמה חדשה:
          <input
            type="password"
            name="confirmPassword"
            value={passwordData.confirmPassword}
            onChange={handlePasswordChangeInput}
            className="input"
          />
        </label>
        {passwordError && <p className="error">{passwordError}</p>}
        <button type="button" className="change-password-btn" onClick={handleChangePassword}>
          שנה סיסמה
        </button>
      </div>
      {notification.message && (
        <Notification
          message={notification.message}
          type={notification.type}
          onClose={() => setNotification({ message: '', type: '' })}
        />
      )}
    </div>
  );
};

export default PersonalArea;
