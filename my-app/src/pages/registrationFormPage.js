import React, { useState, useEffect } from 'react';
import { createUserWithEmailAndPassword } from 'firebase/auth';
import { auth, setDoc, doc, db, signOut } from '../fireBase/firebase';
import '../styles/registrationForm.css';
import { useNavigate } from 'react-router-dom';

const RegistrationForm = () => {
  const navigate = useNavigate();
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
        setError("Date of birth must be in the past.");
        return;
      }

      await createUserWithEmailAndPassword(auth, email, password);
      await addUserToFirestore(email, { email, firstName, lastName, dateOfBirth, age, personalStory, isStoryPublic, gender, isAdmin });

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

      await signOut(auth);

      navigate('/login');
    } catch (error) {
      setError(error.message);
    }
  };

  const addUserToFirestore = async (email, userData) => {
    try {
      await setDoc(doc(db, 'users', email), userData);
    } catch (error) {
      console.error('Error adding user to Firestore:', error);
      throw error;
    }
  };

  return (
    <div className="registration-page">
      <div className="registration-container">
        <h2>Registration Form</h2>
        {error && <p className="error-message">{error}</p>}
        <form className="registration-form" onSubmit={handleRegistration}>
          <label>Email:</label>
          <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} required />
          <label>Password:</label>
          <input type="password" value={password} onChange={(e) => setPassword(e.target.value)} required />
          <label>First Name:</label>
          <input type="text" value={firstName} onChange={(e) => setFirstName(e.target.value)} required />
          <label>Last Name:</label>
          <input type="text" value={lastName} onChange={(e) => setLastName(e.target.value)} required />
          <label>Date of Birth:</label>
          <input type="date" value={dateOfBirth} onChange={(e) => setDateOfBirth(e.target.value)} required />
          <label>Gender:</label>
          <select value={gender} onChange={(e) => setGender(e.target.value)}>
            <option value="">Select</option>
            <option value="male">Male</option>
            <option value="female">Female</option>
          </select>
          <button type="submit">Register</button>
        </form>
      </div>
    </div>
  );
};

export default RegistrationForm;
