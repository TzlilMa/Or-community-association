import React from 'react';
import { useNavigate } from 'react-router-dom';
import { auth } from '../fireBase/firebase'; // Adjust the import path as needed
import NavigationBar from '../navBar'; // Import NavigationBar component
import '../NavigationBar.css'; // Import NavigationBar CSS file

const PersonalArea = () => {
  const navigate = useNavigate();

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
      <NavigationBar />
      <h2>Welcome to your Personal Area</h2>
      <p>This is a protected route. Only accessible after login.</p>
      <button onClick={handleLogout}>Exit</button>
    </div>
  );
};

export default PersonalArea;
