/*import React, { useState } from 'react';
import Calendar from 'react-calendar';
import 'react-calendar/dist/Calendar.css'; // Import the CSS file
import './CalendarComponent.css'; // Custom CSS for the calendar

const CalendarComponent = () => {
  const [date, setDate] = useState(new Date());
  const events = {
    '2024-05-20': [{ title: 'Event 1' }, { title: 'Event 2' }],
    '2024-05-21': [{ title: 'Event 3' }],
  };

  const handleDateChange = (newDate) => {
    setDate(newDate);
  };

  const formatDate = (date) => {
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');
    return `${year}-${month}-${day}`;
  };

  const selectedDateEvents = events[formatDate(date)] || [];

  return (
    <div className="calendar-container">
      <Calendar onChange={handleDateChange} value={date} className="custom-calendar" />
      <div className="events-list">
        <h2>Events on {date.toDateString()}:</h2>
        {selectedDateEvents.length > 0 ? (
          <ul>
            {selectedDateEvents.map((event, index) => (
              <li key={index}>{event.title}</li>
            ))}
          </ul>
        ) : (
          <p>No events for this date.</p>
        )}
      </div>
    </div>
  );
};

export default CalendarComponent;
*/