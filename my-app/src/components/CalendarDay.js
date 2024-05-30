import React from 'react';
import EventDetails from './EventDetails'; // Import the EventDetails component

const CalendarDay = ({ selectedDate, events, handleRegisterForEvent, currentUser }) => {
  const renderEventDetails = () => {
    const filteredEvents = events.filter(event => {
      const eventDate = event.date?.toDate();
      return eventDate && eventDate.toDateString() === selectedDate.toDateString();
    });

    if (filteredEvents.length === 0) {
      return <p>No events</p>;
    }

    return filteredEvents.map(event => (
      <EventDetails 
        key={event.id} 
        event={event} 
        currentUser={currentUser} 
        handleRegisterForEvent={handleRegisterForEvent} 
      />
    ));
  };

  return (
    <div className="calendar-day-events">
      <h3>Events on {selectedDate.toDateString()}</h3>
      {renderEventDetails()}
    </div>
  );
};

export default CalendarDay;
