import React, { useState } from 'react';
import { createUserWithEmailAndPassword } from 'firebase/auth';
import { auth, setDoc, doc, db } from '../fireBase/firebase';
import '../styles/registrationForm.css'; // Import the CSS file
import { useNavigate } from 'react-router-dom'; // Import useNavigate

const RegistrationForm = () => {
  const navigate = useNavigate(); // Initialize useNavigate
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [age, setAge] = useState('');
  const [personalStory, setPersonalStory] = useState('');
  const [isStoryPublic, setIsStoryPublic] = useState(false);
  const [sex, setSex] = useState('');
  const [isAdmin, setIsAdmin] = useState(false);
  const [error, setError] = useState(null);

  const handleRegistration = async (e) => {
    e.preventDefault();
    try {
      // Check if age is above 0
      if (age <= 0) {
        setError("Age must be above 0.");
        return;
      }
      
      // Create user in Firebase Authentication
      const userCredential = await createUserWithEmailAndPassword(auth, email, password);
      const user = userCredential.user;

      // Store additional user data in Firestore
      await addUserToFirestore(user.email, { email, firstName, lastName, age, personalStory, isStoryPublic, sex, isAdmin });

      // Clear form fields
      setEmail('');
      setPassword('');
      setFirstName('');
      setLastName('');
      setAge('');
      setPersonalStory('');
      setIsStoryPublic(false);
      setSex('');
      setIsAdmin(false);

      // Redirect to login page
      navigate('/');
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
        <label>Gender:</label>
        <select value={sex} onChange={(e) => setSex(e.target.value)}>
          <option value="">Select</option>
          <option value="male">Male</option>
          <option value="female">Female</option>
        </select>
        <br />
        <button type="submit">Register</button>
      </form>
    </div>
  );
};

export default RegistrationForm;
