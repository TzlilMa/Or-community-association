// NavigationBar.js
import React, { useState } from "react";
import { Link } from "react-router-dom";
import './NavigationBar.css';  // Assuming you have some CSS for styling
import logo from './logo.jpeg';  // Adjust the path to your logo file

function NavigationBar(props) {
    const [isDropdownOpen, setIsDropdownOpen] = useState(false);

    const handleDropdownToggle = () => {
        setIsDropdownOpen(!isDropdownOpen);
    };

    return (
        <nav className="navbar">
            <div className="navbar-links-container">
                <ul className="navbar-links">
                    <li><Link to="/">Home</Link></li>
                    <li><Link to="/about">About</Link></li>
                    <li className="dropdown">
                        <Link to="#" onClick={handleDropdownToggle}>
                            Services
                        </Link>
                        {isDropdownOpen && (
                            <ul className="dropdown-menu">
                                <li><Link to="/services/category1">Category 1</Link></li>
                                <li><Link to="/services/category2">Category 2</Link></li>
                                <li><Link to="/services/category3">Category 3</Link></li>
                                <li><Link to="/services/category4">Category 4</Link></li>
                                <li><Link to="/services/category5">Category 5</Link></li>
                            </ul>
                        )}
                    </li>
                    <li><Link to="/contact">Contact</Link></li>
                </ul>
            </div>
            <div className="navbar-logo">
                <img src={logo} alt="Logo" />
            </div>
        </nav>
    );
}

export default NavigationBar;
