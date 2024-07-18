import React, { useState } from 'react';
import '../../styles/EventForm.css';

const EventForm = ({ selectedDate, handleAddEvent, newEvent, setNewEvent, setShowEventForm }) => {
  const [error, setError] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();

    if (!newEvent.name || !newEvent.location || !newEvent.description || !newEvent.time) {
      setError('כל השדות הן חובה');
      return;
    }

    const [hours, minutes] = newEvent.time.split(':').map(Number);
    if (isNaN(hours) || isNaN(minutes) || hours < 0 || hours >= 24 || minutes < 0 || minutes >= 60) {
      setError('אנא הזן זמן חוקי בפורמט 24 שעות.');
      return;
    }

    setError('');
    handleAddEvent();
  };

  return (
    <div className="event-edit-form-overlay">
      <div className="event-edit-form-modal">
        <h3>הוסף אירוע ל-{selectedDate.toLocaleDateString()}</h3>
        <form onSubmit={handleSubmit}>
          {error && <p className="error-message">{error}</p>}
          <div>
            <input
              type="text"
              placeholder="שם האירוע"
              value={newEvent.name}
              onChange={e => setNewEvent({ ...newEvent, name: e.target.value })}
            />
          </div>
          <div>
            <input
              type="text"
              placeholder="מיקום"
              value={newEvent.location}
              onChange={e => setNewEvent({ ...newEvent, location: e.target.value })}
            />
          </div>
          <div>
            <textarea
              placeholder="הוסף תיאור"
              value={newEvent.description}
              onChange={e => setNewEvent({ ...newEvent, description: e.target.value })}
            />
          </div>
          <div>
            <input
              type="time"
              placeholder="זמן"
              value={newEvent.time}
              onChange={e => setNewEvent({ ...newEvent, time: e.target.value })}
            />
          </div>
          <div className="event-edit-form-actions-container">
            <button type="submit" className="event-edit-form-actions">הוסף אירוע</button>
            <button type="button" className="button-cancel" onClick={() => setNewEvent({ name: '', location: '', description: '', time: '' }, setShowEventForm(false))}>ביטול</button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default EventForm;
