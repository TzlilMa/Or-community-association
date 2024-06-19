import React, { useEffect, useState } from 'react';
import { db, doc, getDoc, setDoc, auth } from '../../fireBase/firebase'; // Adjust the import path as needed
import ChangePasswordPopup from './ChangePasswordPopup';
import '../../styles/PersonalArea.css'; // Ensure this path is correct

const Popup = ({ message, onClose }) => {
  return (
    <div className="popup">
      <div className="popup-content">
        <p>{message}</p>
        <button onClick={onClose}>סגור</button>
      </div>
    </div>
  );
};

const PersonalArea = () => {
  const [userData, setUserData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    personalStory: '',
    isStoryPublic: false,
  });
  const [loading, setLoading] = useState(true);
  const [storyLength, setStoryLength] = useState(0);
  const [showPopup, setShowPopup] = useState(false);
  const [popupMessage, setPopupMessage] = useState('');
  const [showChangePassword, setShowChangePassword] = useState(false);

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

  const MAX_CHARS = 5000;

  const handleInputChange = (event) => {
    const { name, value } = event.target;

    if (name === 'personalStory' && value.length <= MAX_CHARS) {
      setStoryLength(value.length);
    }

    setUserData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  const handleCheckboxChange = (event) => {
    setUserData((prevData) => ({
      ...prevData,
      isStoryPublic: event.target.checked,
    }));
  };

  const handleFormSubmit = async (event) => {
    event.preventDefault();

    if (!userData.firstName.trim() || !userData.lastName.trim()) {
      setPopupMessage('שם פרטי ושם משפחה הינם שדות חובה');
      setShowPopup(true);
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
      setPopupMessage('לא בוצעו שינויים');
      setShowPopup(true);
      return;
    }

    try {
      await setDoc(doc(db, 'users', auth.currentUser.email), userData);
      setPopupMessage('הנתונים נשמרו בהצלחה');
      setShowPopup(true);
    } catch (error) {
      console.error('Error updating user data:', error);
      setPopupMessage('אירעה שגיאה בעדכון הנתונים');
      setShowPopup(true);
    }
  };

  const handleChangePassword = () => {
    setShowChangePassword(true);
  };

  const handleCloseChangePassword = () => {
    setShowChangePassword(false);
  };

  if (loading) {
    return <div>Loading...</div>;
  }

  return (
    <div className="personal-area">
      <h1>!{userData.firstName}, איזה כיף שאתה פה</h1>
      <h3>הינה הפרטים שלך כפי שהם מעודכנים במערכת</h3>
      <form onSubmit={handleFormSubmit} className="personal-area-form">
        <label className="form-label">
          :שם פרטי
          <input
            type="text"
            name="firstName"
            value={userData.firstName}
            onChange={handleInputChange}
            className="input"
          />
        </label>
        <label className="form-label">
          :שם משפחה
          <input
            type="text"
            name="lastName"
            value={userData.lastName}
            onChange={handleInputChange}
            className="input"
          />
        </label>
        <label className="form-label">
          :כתובת מייל
          <input
            type="email"
            name="email"
            value={userData.email}
            readOnly
            className="input read-only"
          />
        </label>
        <h2>הסיפור שלי</h2>
        <p>
          !קהילת אור מאפשרת לחברי הקהילה לשתף את הסיפור האישי שלהם. כאן זה המקום לעשות זאת
        </p>
        <textarea
          name="personalStory"
          value={userData.personalStory}
          onChange={handleInputChange}
          className="story-textarea"
          dir="rtl"
          maxLength={MAX_CHARS}
          placeholder='הקלד כאן את הסיפור שלך...'
        />
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
        <div className='btns-personal-area'>
          <button type="submit" className="submit-btn">שמור</button>
          <button type="button" className="change-password-btn" onClick={handleChangePassword}>
            שנה סיסמה
          </button>
        </div>
      </form>
      {showPopup && <Popup message={popupMessage} onClose={() => setShowPopup(false)} />}
      {showChangePassword && <ChangePasswordPopup onClose={handleCloseChangePassword} />}
    </div>
  );
};

export default PersonalArea;
