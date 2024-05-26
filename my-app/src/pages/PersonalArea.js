import React from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { auth } from '../login/firebase'; // Adjust the import path as needed
import NavigationBar from '../navBar'; // Import NavigationBar component
import '../NavigationBar.css'; // Import NavigationBar CSS file

const PersonalArea = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { email, firstName } = location.state || {};  // Access email and firstName from the state

  const handleLogout = async () => {
    try {
      await auth.signOut();
      navigate('/'); // Redirect to the login page after logout
    } catch (error) {
      console.error('Error logging out:', error);
    }
  };

  return (
    <div>
      <NavigationBar email={email} firstName={firstName} />
      <div className="personal-area-content">
        <h2>Welcome to your Personal Area</h2>
        {firstName && <p>Welcome, {firstName}!</p>}
        {email && <p>Your email: {email}</p>}
        <p>This is a protected route. Only accessible after login.</p>
        <button onClick={handleLogout}>Exit</button>
      </div>
    </div>
  );
};

export default PersonalArea;
