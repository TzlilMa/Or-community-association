// NavigationBar.js
import React from "react";
import { Link } from "react-router-dom";
import './NavigationBar.css';  // Assuming you have some CSS for styling

function NavigationBar(props) {
    return (
        <nav className="navbar">
            <div className="navbar-brand">
                <Link to="/">BrandName</Link>
            </div>
            <ul className="navbar-links">
                <li><Link to="/">Home</Link></li>
                <li><Link to="/about">About</Link></li>
                <li><Link to="/services">Services</Link></li>
                <li><Link to="/contact">Contact</Link></li>
            </ul>
        </nav>
    );
}

export default NavigationBar;
