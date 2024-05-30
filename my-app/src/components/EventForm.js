import React from 'react';

const EventForm = ({ selectedDate, handleAddEvent, newEvent, setNewEvent }) => {
  return (
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
                type="text"
                placeholder="Add description"
                value={newEvent.description}
                onChange={e => setNewEvent({ ...newEvent, description: e.target.value })}
              />
              <input
                type="time"
                placeholder="Time"
                value={newEvent.time}
                onChange={e => setNewEvent({ ...newEvent, time: e.target.value })}
              />
      <button onClick={handleAddEvent}>Add Event</button>
      </div>
  );
};

export default EventForm;
