import React, { useState, useEffect } from 'react';
import { useAuth } from '../fireBase/AuthContext';
import { db, collection, addDoc, getDocs, Timestamp, doc, updateDoc, arrayUnion, query, where, increment } from '../fireBase/firebase'; // Import Firebase functions
import '../styles/Calendar.css';
import EventForm from './EventForm';
import CalendarDay from './CalendarDay';


const Calendar = () => {
  const { currentUser } = useAuth();
  const [events, setEvents] = useState([]);
  const [selectedDate, setSelectedDate] = useState(null);
  const [newEvent, setNewEvent] = useState({ name: '', location: '', description: '', numUsers: 0, time: '' });
  const [isAdmin, setIsAdmin] = useState(false);

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
  
    const fetchUserData = async () => {
      try {
        // Fetch user data based on the current user's email
        const userQuerySnapshot = await getDocs(query(collection(db, 'users'), where('email', '==', currentUser.email)));
        
        // If user exists and isAdmin is true, set isAdmin to true
        if (!userQuerySnapshot.empty) {
          const userData = userQuerySnapshot.docs[0].data();
          setIsAdmin(userData.isAdmin || false);
        } else {
          setIsAdmin(false);
        }
      } catch (error) {
        console.error('Error fetching user data:', error);
        setIsAdmin(false);
      }
    };
  
    if (currentUser) {
      fetchUserData();
      console.log("currentUser:", currentUser);
      console.log("isAdmin:", isAdmin);
    }
  }, [currentUser, isAdmin]); // Update when currentUser or isAdmin changes
  

  const handleAddEvent = async () => {
    

    if (!selectedDate || !newEvent.time) {
      alert('Please select a date and time for the event.');
      return;
    }

    const [hours, minutes] = newEvent.time.split(':').map(Number);

    if (isNaN(hours) || isNaN(minutes) || hours < 0 || hours >= 24 || minutes < 0 || minutes >= 60) {
      alert('Please enter a valid time in 24-hour format.');
      return;
    }

    const eventDateTime = new Date(selectedDate);
    eventDateTime.setHours(hours, minutes, 0, 0);

    const eventTimestamp = Timestamp.fromDate(eventDateTime);

    const { time, ...eventData } = newEvent;

    const newEventDoc = { ...eventData, date: eventTimestamp };

    try {
      const docRef = await addDoc(collection(db, 'events'), newEventDoc);
      setEvents([...events, { ...newEventDoc, id: docRef.id }]);
      setNewEvent({ name: '', location: '', description: '', numUsers: 0, time: '' });
      setSelectedDate(null);
      alert('Event added successfully!');
    } catch (error) {
      console.error('Error adding event:', error);
      alert('An error occurred while adding the event. Please try again later.');
    }
  };

  const handleRegisterForEvent = async (eventId) => {
    if (!currentUser) {
      alert('Please log in to register for events.');
      return;
    }

    try {
      const eventRef = doc(db, 'events', eventId);
      await updateDoc(eventRef, {
        registeredUsers: arrayUnion(currentUser.email)
      });

      // Increment the numUsers field by 1
    await updateDoc(eventRef, {
      numUsers: increment(1),
      registeredUsers: arrayUnion(currentUser.email)
    });

      alert('Successfully registered for the event!');
      // Update the local state to reflect the registration
      setEvents(events.map(event => event.id === eventId ? { ...event, registeredUsers: [...(event.registeredUsers || []), currentUser.email] } : event));
    } catch (error) {
      console.error('Error registering for event:', error);
      alert('An error occurred while registering for the event. Please try again later.');
    }
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
            {events.some(event => {
              const eventDate = event.date?.toDate();
              return eventDate &&
                eventDate.getDate() === day &&
                eventDate.getMonth() === currentMonth &&
                eventDate.getFullYear() === currentYear;
            }) && (
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
      <div className="calendar-content">
        <div className="calendar-column">
          {renderDaysOfWeek()}
          {renderDaysInMonth()}
        </div>
        <div className="details-column">
        {selectedDate && (
  <div className="event-details-container">
    {isAdmin && (
      <div className="event-form">
        <EventForm
          selectedDate={selectedDate}
          handleAddEvent={handleAddEvent}
          newEvent={newEvent}
          setNewEvent={setNewEvent}
        />
      </div>
    )}
    <div className="event-details">
      <CalendarDay
        selectedDate={selectedDate}
        events={events}
        handleRegisterForEvent={handleRegisterForEvent}
        currentUser={currentUser}
      />
    </div>
  </div>
)}
        </div>
      </div>
    </div>
  );
};

export default Calendar;
