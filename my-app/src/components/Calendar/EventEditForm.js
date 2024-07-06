import React, { useState, useEffect } from 'react';
import { Timestamp } from 'firebase/firestore';
import '../../styles/EventEditForm.css';

const EventEditForm = ({ event, onSubmit, onCancel }) => {
  const [name, setName] = useState(event.name);
  const [location, setLocation] = useState(event.location);
  const [description, setDescription] = useState(event.description);
  const [date, setDate] = useState(event.date.toDate());
  const [time, setTime] = useState('');
  const [error, setError] = useState('');

  useEffect(() => {
    const eventDate = event.date.toDate();
    const eventTime = eventDate.toTimeString().split(' ')[0].substring(0, 5);
    setTime(eventTime);
  }, [event]);

  const handleSubmit = (e) => {
    e.preventDefault();

    if (!name || !location || !description || !date || !time) {
      setError('כל השדות הן חובה');
      return;
    }

    const [hours, minutes] = time.split(':').map(Number);
    if (isNaN(hours) || isNaN(minutes) || hours < 0 || hours >= 24 || minutes < 0 || minutes >= 60) {
      setError('Please enter a valid time in 24-hour format.');
      return;
    }
  
    const eventDateTime = new Date(date);
    eventDateTime.setHours(hours, minutes, 0, 0);
  
    const timestampValue = Timestamp.fromDate(eventDateTime);
  
    const updatedEvent = {
      name,
      location,
      description,
      date: timestampValue,
      time: `${hours}:${minutes}`
    };
    onSubmit(updatedEvent);
  };

  const formatDateForInput = (date) => {
    const year = date.getFullYear();
    const month = (date.getMonth() + 1).toString().padStart(2, '0');
    const day = date.getDate().toString().padStart(2, '0');
    return `${year}-${month}-${day}`;
  };

  return (
    <div className="event-edit-form-overlay">
      <div className="event-edit-form-modal">
        <h3>עריכת אירוע</h3>
        <form onSubmit={handleSubmit}>
          {error && <p className="error-message">{error}</p>}
          <div>
            <label htmlFor="name">שם האירוע:</label>
            <input
              type="text"
              id="name"
              value={name}
              onChange={(e) => setName(e.target.value)}
            />
          </div>
          <div>
            <label htmlFor="location">מיקום:</label>
            <input
              type="text"
              id="location"
              value={location}
              onChange={(e) => setLocation(e.target.value)}
            />
          </div>
          <div>
            <label htmlFor="description">תיאור:</label>
            <textarea
              id="description"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
            />
          </div>
          <div>
            <label htmlFor="date">תאריך:</label>
            <input
              type="date"
              id="date"
              value={formatDateForInput(date)}
              onChange={(e) => setDate(new Date(e.target.value))}
            />
          </div>
          <div>
            <label htmlFor="time">שעה:</label>
            <input
              type="time"
              id="time"
              value={time}
              onChange={(e) => setTime(e.target.value)}
            />
          </div>
          <div className="event-edit-form-actions-container">
            <button type="submit" className="event-edit-form-actions">שמור</button>
            <button type="button" className="event-edit-form-actions button-cancel" onClick={onCancel}>ביטול</button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default EventEditForm;
