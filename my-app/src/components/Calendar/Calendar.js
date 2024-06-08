// src/components/Calendar/Calendar.js
import React from 'react';
import { useAuth } from '../../fireBase/AuthContext'; // Adjusted to match the correct path
import '../../styles/Calendar.css'; // Ensure this path is correct

const Calendar = () => {
  const { currentUser } = useAuth();

  return (
    <div className="calendar-container">
      <h1>Calendar Component</h1>
      {currentUser && <p>Welcome, {currentUser.email}</p>}
    </div>
  );
};

export default Calendar;
