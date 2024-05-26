import React, { useState } from 'react';
import { createUserWithEmailAndPassword } from 'firebase/auth';
import { auth,setDoc, doc, db } from './fireBase/firebase';
import './registrationForm.css'; // Import the CSS file


const RegistrationForm = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [age, setAge] = useState('');
  const [personalStory, setPersonalStory] = useState('');
  const [sex, setSex] = useState('');
  const [isAdmin, setIsAdmin] = useState(false);
  const [error, setError] = useState(null);

  const handleRegistration = async (e) => {
    e.preventDefault();
    try {
      // Create user in Firebase Authentication
      const userCredential = await createUserWithEmailAndPassword(auth, email, password);
      const user = userCredential.user;

      // Store additional user data in Firestore
      await addUserToFirestore(user.email, { email, firstName, lastName, age, personalStory, sex, isAdmin });

      // Clear form fields
      setEmail('');
      setPassword('');
      setFirstName('');
      setLastName('');
      setAge('');
      setPersonalStory('');
      setSex('');
      setIsAdmin(false);
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
    <div>
      <h2>Registration Form</h2>
      {error && <p>{error}</p>}
      <form onSubmit={handleRegistration}>
        <label>Email:</label>
        <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} required />
        <br />
        <label>Password:</label>
        <input type="password" value={password} onChange={(e) => setPassword(e.target.value)} required />
        <br />
        <label>First Name:</label>
        <input type="text" value={firstName} onChange={(e) => setFirstName(e.target.value)} required />
        <br />
        <label>Last Name:</label>
        <input type="text" value={lastName} onChange={(e) => setLastName(e.target.value)} required />
        <br />
        <label>Age:</label>
        <input type="number" value={age} onChange={(e) => setAge(e.target.value)} />
        <br />
        <label>Personal Story:</label>
        <textarea value={personalStory} onChange={(e) => setPersonalStory(e.target.value)} />
        <br />
        <label>Sex:</label>
        <select value={sex} onChange={(e) => setSex(e.target.value)}>
          <option value="">Select</option>
          <option value="male">Male</option>
          <option value="female">Female</option>
        </select>
        <br />
        <label>Is Admin:</label>
        <input type="checkbox" checked={isAdmin} onChange={(e) => setIsAdmin(e.target.checked)} />
        <br />
        <button type="submit">Register</button>
      </form>
    </div>
  );
};

export default RegistrationForm;
