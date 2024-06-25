// EventEditForm.js
import React, { useState } from 'react';
import { Timestamp } from 'firebase/firestore';
import '../../styles/EventEditForm.css';

const EventEditForm = ({ event, onSubmit, onCancel }) => {
  const [name, setName] = useState(event.name);
  const [location, setLocation] = useState(event.location);
  const [description, setDescription] = useState(event.description);
  const [date, setDate] = useState(event.date.toDate());
  const [time, setTime] = useState(event.time);

  const handleSubmit = (e) => {
    e.preventDefault();
    const [hours, minutes] = time.split(':').map(Number);
    if (isNaN(hours) || isNaN(minutes) || hours < 0 || hours >= 24 || minutes < 0 || minutes >= 60) {
      alert('Please enter a valid time in 24-hour format.');
      return;
    }
  
    const eventDateTime = new Date(date);
    eventDateTime.setHours(hours, minutes, 0, 0);
  
    // Create a new Timestamp instance
    const timestampValue = Timestamp.fromDate(eventDateTime);
  
    const updatedEvent = {
      name,
      location,
      description,
      date: timestampValue
    };
    onSubmit(updatedEvent);
  };

  return (
    <div className="event-edit-form-overlay">
      <div className="event-edit-form-modal">
        <h3>עריכת אירוע</h3>
        <form onSubmit={handleSubmit}>
          <div>
            <label htmlFor="name">:שם האירוע</label>
            <input
              type="text"
              id="name"
              value={name}
              onChange={(e) => setName(e.target.value)}
            />
          </div>
          <div>
            <label htmlFor="location">:מיקום</label>
            <input
              type="text"
              id="location"
              value={location}
              onChange={(e) => setLocation(e.target.value)}
            />
          </div>
          <div>
            <label htmlFor="description">
              :תיאור
            </label>
            <textarea
              id="description"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
            />
          </div>
          <div>
            <label htmlFor="date">:תאריך</label>
            <input
              type="date"
              id="date"
              value={date.toDate}
              onChange={(e) => setDate(new Date(e.target.value))}
            />
          </div>
          <div>
            <label htmlFor="time">:שעה</label>
            <input
              type="time"
              id="time"
              value={time}
              onChange={(e) => setTime(e.target.value)}
            />
          </div>
          
            <button className="event-edit-form-actions" type="submit">Save</button>
            <button className="event-edit-form-actions" type="button" onClick={onCancel}>
              Cancel
            </button>
          
        </form>
      </div>
    </div>
  );
};

export default EventEditForm;