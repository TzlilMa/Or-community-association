import React from 'react';
import { Link } from 'react-router-dom';
import './NavigationBar.css'; // Assuming you have some CSS for styling

const NavigationBar = ({ email }) => {
  return (
    <nav className="navbar">
      <div className="navbar-left">
        {email && <p>Hello, {email}!</p>}
      </div>
      <ul className="navbar-links">
        <li><Link to="/">Home</Link></li>
        <li><Link to="/about">About</Link></li>
        <li className="dropdown">
          <Link to="/services" className="dropbtn">Services</Link>
          <div className="dropdown-content">
            <Link to="/services/category1">Category 1</Link>
            <Link to="/services/category2">Category 2</Link>
            <Link to="/services/category3">Category 3</Link>
            <Link to="/services/category4">Category 4</Link>
            <Link to="/services/category5">Category 5</Link>
          </div>
        </li>
        <li><Link to="/contact">Contact</Link></li>
      </ul>
    </nav>
  );
};

export default NavigationBar;
