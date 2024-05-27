// src/pages/PersonalArea.js
import React, { useEffect, useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { auth, db, doc, getDoc } from '../fireBase/firebase'; // Adjust the import path as needed
import NavigationBar from '../components/navBar'; // Import NavigationBar component
import '../styles/NavigationBar.css'; // Import NavigationBar CSS file

const Homepage = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { email } = location.state || {}; // Access email from the state
  const [firstName, setFirstName] = useState('');

  const handleLogout = async () => {
    try {
      await auth.signOut();
      navigate('/'); // Redirect to the login page after logout
    } catch (error) {
      console.error('Error logging out:', error);
    }
  };

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        if (!email) {
          console.error('Email is not provided.');
          return;
        }
  
        const userDoc = await getDoc(doc(db, 'users', email));
        if (userDoc.exists()) {
          const userData = userDoc.data();
          setFirstName(userData.firstName); // Assuming 'firstName' is the field name in the user document
        } else {
          console.error('User document does not exist.');
        }
      } catch (error) {
        console.error('Error fetching user data:', error);
      }
    };
  
    fetchUserData();
  }, [email]);
  

  return (
    <div>
      <NavigationBar email={email} firstName={firstName} />
      <div className="personal-area-content">
        <h1>Welcome to your Personal Area</h1>
        <p>Hello, {firstName}</p>
        <p>This is a protected route. Only accessible after login.</p>
        <button onClick={handleLogout}>Exit</button>
      </div>
    </div>
  );
};

export default Homepage;
