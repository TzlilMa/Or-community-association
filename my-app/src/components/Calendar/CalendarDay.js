import React from 'react';
import EventDetails from './EventDetails'; // Import the EventDetails component

const CalendarDay = ({ selectedDate, events, handleRegisterForEvent, currentUser, updateEvents }) => {
  const renderEventDetails = () => {
    const filteredEvents = events.filter(event => {
      const eventDate = event.date?.toDate();
      return eventDate && eventDate.toLocaleDateString() === selectedDate.toLocaleDateString();
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
        updateEvents={updateEvents}
      />
    ));
  };

  return (
    <div className="calendar-day-events">
      {renderEventDetails()}
    </div>
  );
};

export default CalendarDay;
