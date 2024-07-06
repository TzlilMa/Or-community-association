import React from 'react';
import '../../styles/EventForm.css';

const EventForm = ({ selectedDate, handleAddEvent, newEvent, setNewEvent, setShowEventForm }) => {
  return (
    <div className="event-edit-form-overlay">
      <div className="event-edit-form-modal">
        <h3>הוסף אירוע ל-{selectedDate.toLocaleDateString()}</h3>
        <form>
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
            <input
              type="text"
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
            <button type="button" className="event-edit-form-actions" onClick={handleAddEvent}>הוסף אירוע</button>
            <button type="button" className="button-cancel" onClick={() => setNewEvent({ name: '', location: '', description: '', time: '' }, setShowEventForm(false))}>ביטול</button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default EventForm;
