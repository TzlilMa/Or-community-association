// src/navBar.js
import React, { useState } from "react";
import { Link } from "react-router-dom";
import '../styles/NavigationBar.css';  // Assuming you have some CSS for styling
import logo from '../assets/logo.jpeg';  // Adjust the path to your logo file

const NavigationBar = ({ email, firstName }) => {
    const [isDropdownOpen, setIsDropdownOpen] = useState(false);

    const handleDropdownToggle = () => {
        setIsDropdownOpen(!isDropdownOpen);
    };

    return (
        <nav className="navbar">
          {firstName && (
                <div className="navbar-user">
                    Hello, {firstName}!
                </div>
            )}

            <div className="navbar-links-container">
                <ul className="navbar-links">
                    <li><Link to="#">Home</Link></li>
                    <li><Link to="#">About</Link></li>
                    <li className="dropdown">
                        <Link to="#" onClick={handleDropdownToggle}>
                            Services
                        </Link>
                        {isDropdownOpen && (
                            <ul className="dropdown-menu">
                                <li><Link to="#">Category 1</Link></li>
                                <li><Link to="#">Category 2</Link></li>
                                <li><Link to="#">Category 3</Link></li>
                                <li><Link to="#">Category 4</Link></li>
                                <li><Link to="#">Category 5</Link></li>
                            </ul>
                        )}
                    </li>
                    <li><Link to="#">Contact</Link></li>
                    <li><Link to="#">Calendar</Link></li>
                </ul>
            </div>
            <div className="navbar-logo">
                <img src={logo} alt="Logo" />
            </div>
            
        </nav>
    );
};

export default NavigationBar;
