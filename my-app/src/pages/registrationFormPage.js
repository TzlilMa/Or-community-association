import React, { useState, useEffect } from 'react';
import { createUserWithEmailAndPassword } from 'firebase/auth';
import { auth, setDoc, doc, db } from '../fireBase/firebase';
import '../styles/registrationForm.css';

const RegistrationForm = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [dateOfBirth, setDateOfBirth] = useState('');
  const [age, setAge] = useState(null);
  const [personalStory, setPersonalStory] = useState('');
  const [isStoryPublic, setIsStoryPublic] = useState(false);
  const [gender, setGender] = useState('');
  const [isAdmin, setIsAdmin] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (dateOfBirth) {
      const birthDate = new Date(dateOfBirth);
      const today = new Date();
      const ageInMilliseconds = today - birthDate;
      const calculatedAge = Math.floor(ageInMilliseconds / (1000 * 60 * 60 * 24 * 365.25));
      setAge(calculatedAge);
    } else {
      setAge(null);
    }
  }, [dateOfBirth]);

  const handleRegistration = async (e) => {
    e.preventDefault();
    try {
      const currentDate = new Date();
      const birthDate = new Date(dateOfBirth);
      if (birthDate >= currentDate) {
        setError("אופס... תאריך הלידה לא תקין");
        return;
      }
  
      // Register user with email and password
      await createUserWithEmailAndPassword(auth, email, password);
  
      // Add user details to Firestore
      const userData = { email, firstName, lastName, dateOfBirth, age, personalStory, isStoryPublic, gender, isAdmin };
      await setDoc(doc(db, 'users', email), userData);
  
      // Clear form fields and state
      setEmail('');
      setPassword('');
      setFirstName('');
      setLastName('');
      setDateOfBirth('');
      setAge(null);
      setPersonalStory('');
      setIsStoryPublic(false);
      setGender('');
      setIsAdmin(false);
      setError(null);
  
    } catch (error) {
      setError('אופס... משהו השתבש, אנא נסה שוב');
    }
  };
  

  return (
    <div className="registration-page">
      <div className="gradient-background"></div>
      <div className="registration-container">
        <h2>טופס הרשמה</h2>
        {error && <p className="error-message">{error}</p>}
        <form className="registration-form" onSubmit={handleRegistration}>
          <label>:כתובת מייל</label>
          <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} required />
          <label>:סיסמא</label>
          <input type="password" value={password} onChange={(e) => setPassword(e.target.value)} required />
          <label>:שם פרטי</label>
          <input type="text" value={firstName} onChange={(e) => setFirstName(e.target.value)} required />
          <label>:שם משפחה</label>
          <input type="text" value={lastName} onChange={(e) => setLastName(e.target.value)} required />
          <label>:תאריך לידה</label>
          <input type="date" value={dateOfBirth} onChange={(e) => setDateOfBirth(e.target.value)} required />
          <label>:מגדר</label>
          <select value={gender} onChange={(e) => setGender(e.target.value)}>
            <option value="">בחר</option>
            <option value="male">זכר</option>
            <option value="female">נקבה</option>
          </select>
          <button type="submit">הרשם עכשיו</button>
        </form>
      </div>
    </div>
  );
};

export default RegistrationForm;
