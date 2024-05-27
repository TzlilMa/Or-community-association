import React from 'react';
import logo from '../assets/logo.jpeg'; // Adjust the path as necessary
import '../styles/Logo.css'; // Import the CSS file for styling

const Logo = () => {
  return (
    <div className="logo-container">
      <img src={logo} alt="Logo" className="logo-image" />
    </div>
  );
};

export default Logo;
