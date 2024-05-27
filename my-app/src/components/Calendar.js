import React, { useState, useEffect } from 'react';
import { db, collection, addDoc, getDocs, Timestamp } from '../fireBase/firebase'; // Adjust the import path as necessary
import '../styles/Calendar.css'; // Ensure you have the appropriate CSS

const Calendar = () => {
  const [events, setEvents] = useState([]);
  const [selectedDate, setSelectedDate] = useState(null);
  const [newEvent, setNewEvent] = useState({ name: '', location: '', numUsers: 0 });

  const daysOfWeek = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
  const today = new Date();
  const currentMonth = today.getMonth();
  const currentYear = today.getFullYear();

  useEffect(() => {
    const fetchEvents = async () => {
      const eventsSnapshot = await getDocs(collection(db, 'events'));
      const eventsData = eventsSnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
      setEvents(eventsData);
    };
    fetchEvents();
  }, []);

  const handleAddEvent = async () => {
    const eventDate = new Date(selectedDate);
    const newEventDoc = { ...newEvent, date: Timestamp.fromDate(eventDate) };
    await addDoc(collection(db, 'events'), newEventDoc);
    setEvents([...events, { ...newEventDoc, id: newEventDoc.id }]);
    setNewEvent({ name: '', location: '', numUsers: 0 });
    setSelectedDate(null);
  };

  const renderDaysOfWeek = () => {
    return (
      <div className="days-of-week">
        {daysOfWeek.map(day => (
          <div key={day} className="day-header">
            {day}
          </div>
        ))}
      </div>
    );
  };

  const renderDaysInMonth = () => {
    const firstDayOfMonth = new Date(currentYear, currentMonth, 1).getDay();
    const daysInMonth = new Date(currentYear, currentMonth + 1, 0).getDate();
    const daysArray = Array.from({ length: daysInMonth }, (_, i) => i + 1);

    return (
      <div className="days-grid">
        {Array.from({ length: firstDayOfMonth }).map((_, i) => (
          <div key={`empty-${i}`} className="day-empty" />
        ))}
        {daysArray.map(day => (
          <div
            key={day}
            className="calendar-day"
            onClick={() => setSelectedDate(new Date(currentYear, currentMonth, day))}
          >
            {day}
            {events.some(event => new Date(event.date.toDate()).getDate() === day && new Date(event.date.toDate()).getMonth() === currentMonth && new Date(event.date.toDate()).getFullYear() === currentYear) && (
              <div className="event-indicator">•</div>
            )}
          </div>
        ))}
      </div>
    );
  };

  return (
    <div className="calendar-container">
      <div className="calendar-header">
        <h2>
          {today.toLocaleString('default', { month: 'long' })} {currentYear}
        </h2>
      </div>
      {renderDaysOfWeek()}
      {renderDaysInMonth()}
      {selectedDate && (
        <div className="add-event-form">
          <h3>Add Event for {selectedDate.toDateString()}</h3>
          <input
            type="text"
            placeholder="Event Name"
            value={newEvent.name}
            onChange={e => setNewEvent({ ...newEvent, name: e.target.value })}
          />
          <input
            type="text"
            placeholder="Location"
            value={newEvent.location}
            onChange={e => setNewEvent({ ...newEvent, location: e.target.value })}
          />
          <input
            type="number"
            placeholder="Number of Users"
            value={newEvent.numUsers}
            onChange={e => setNewEvent({ ...newEvent, numUsers: parseInt(e.target.value) })}
          />
          <button onClick={handleAddEvent}>Add Event</button>
        </div>
      )}
    </div>
  );
};

export default Calendar;
