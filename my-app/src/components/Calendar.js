import React, { useState, useEffect } from 'react';
import firebase from 'firebase/app';
import 'firebase/firestore';
import '../styles/Calendar.css';

const Calendar = ({ currentUser }) => {
  const [events, setEvents] = useState([]);
  const [userEvents, setUserEvents] = useState([]);
  const [selectedDate, setSelectedDate] = useState(null);

  useEffect(() => {
    const fetchEvents = async () => {
      const eventsSnapshot = await firebase.firestore().collection('events').get();
      const eventsData = eventsSnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
      setEvents(eventsData);

      const userEventsSnapshot = await firebase.firestore().collection('users_event').where('email', '==', currentUser.email).get();
      const userEventsData = userEventsSnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
      setUserEvents(userEventsData);
    };
    fetchEvents();
  }, [currentUser.email]);

  const handleRegister = async (eventID) => {
    await firebase.firestore().collection('users_event').add({ email: currentUser.email, eventID });
    setUserEvents([...userEvents, { email: currentUser.email, eventID }]);
  };

  const handleUnregister = async (eventID) => {
    const userEventDoc = userEvents.find(ue => ue.eventID === eventID);
    await firebase.firestore().collection('users_event').doc(userEventDoc.id).delete();
    setUserEvents(userEvents.filter(ue => ue.eventID !== eventID));
  };

  const handleAddEvent = async (eventDate) => {
    const newEvent = { eventDate, description: 'New Event' };
    const newEventDoc = await firebase.firestore().collection('events').add(newEvent);
    setEvents([...events, { id: newEventDoc.id, ...newEvent }]);
  };

  const handleEditEvent = async (eventID, newDescription) => {
    await firebase.firestore().collection('events').doc(eventID).update({ description: newDescription });
    setEvents(events.map(event => event.id === eventID ? { ...event, description: newDescription } : event));
  };

  const handleCancelEvent = async (eventID) => {
    await firebase.firestore().collection('events').doc(eventID).delete();
    setEvents(events.filter(event => event.id !== eventID));
  };

  const renderCalendarDays = () => {
    const daysInMonth = new Date().getDate();
    const daysArray = Array.from({ length: daysInMonth }, (_, i) => i + 1);

    return daysArray.map(day => {
      const dayEvents = events.filter(event => new Date(event.eventDate).getDate() === day);
      const isRegistered = userEvents.some(ue => dayEvents.some(event => event.id === ue.eventID));
      return (
        <div
          key={day}
          className={`calendar-day ${dayEvents.length ? 'event-day' : ''}`}
          onClick={() => setSelectedDate(day)}
        >
          {day}
          {isRegistered && <div className="registered">Registered</div>}
        </div>
      );
    });
  };

  return (
    <div className="calendar">
      {renderCalendarDays()}
      {selectedDate && currentUser.is_admin && (
        <div className="admin-controls">
          <button onClick={() => handleAddEvent(selectedDate)}>Add Event</button>
          <button onClick={() => handleCancelEvent(selectedDate)}>Cancel Event</button>
          <button onClick={() => handleEditEvent(selectedDate, 'Edited Event Description')}>Edit Event</button>
        </div>
      )}
    </div>
  );
};

export default Calendar;
