import React, { useState, useEffect } from 'react';
import { useAuth } from '../../fireBase/AuthContext';
import { db, collection, addDoc, getDocs, Timestamp, doc, updateDoc, arrayUnion, query, where, increment } from '../../fireBase/firebase';
import '../../styles/Calendar.css';
import EventForm from './EventForm';
import CalendarDay from './CalendarDay';
import Notification from '../General/Notification';

const Calendar = () => {
  const today = new Date();
  const { currentUser } = useAuth();
  const [events, setEvents] = useState([]);
  const [selectedDate, setSelectedDate] = useState(today);
  const [newEvent, setNewEvent] = useState({ name: '', location: '', description: '', numUsers: 0, time: '' });
  const [isAdmin, setIsAdmin] = useState(false);
  const [firstName, setFirstName] = useState('');
  const [showEventForm, setShowEventForm] = useState(false);
  const [currentMonth, setCurrentMonth] = useState(today.getMonth());
  const [currentYear, setCurrentYear] = useState(today.getFullYear());
  const [notification, setNotification] = useState({ message: '', type: '' });

  const daysOfWeek = ['א', 'ב', 'ג', 'ד', 'ה', 'ו', 'ש'];

  useEffect(() => {
    const fetchEvents = async () => {
      const eventsSnapshot = await getDocs(collection(db, 'events'));
      const eventsData = eventsSnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
      setEvents(eventsData);
    };

    const fetchUserData = async () => {
      try {
        const userQuerySnapshot = await getDocs(query(collection(db, 'users'), where('email', '==', currentUser.email)));
        if (!userQuerySnapshot.empty) {          
          const userData = userQuerySnapshot.docs[0].data();
          setIsAdmin(userData.isAdmin || false);
          setFirstName(userData.firstName || '');
        } else {
          setIsAdmin(false);
        }
      } catch (error) {
        console.error('Error fetching user data:', error);
        setIsAdmin(false);
      }
    };

    fetchEvents();
    if (currentUser) {
      fetchUserData();
    }
  }, [currentUser]);

  const handleAddEvent = async () => {
    if (!selectedDate || !newEvent.time) {
      setNotification({ message: 'Please select a date and time for the event.', type: 'error' });
      return;
    }

    const [hours, minutes] = newEvent.time.split(':').map(Number);
    if (isNaN(hours) || isNaN(minutes) || hours < 0 || hours >= 24 || minutes < 0 || minutes >= 60) {
      setNotification({ message: 'Please enter a valid time in 24-hour format.', type: 'error' });
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
      setShowEventForm(false);
      setNotification({ message: 'Event added successfully!', type: 'success' });
    } catch (error) {
      console.error('Error adding event:', error);
      setNotification({ message: 'An error occurred while adding the event. Please try again later.', type: 'error' });
    }
  };

  const updateEvents = async () => {
    try {
      const eventsSnapshot = await getDocs(collection(db, 'events'));
      const eventsData = eventsSnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
      setEvents(eventsData);
    } catch (error) {
      console.error('Error fetching events:', error);
    }
  };

  const handleRegisterForEvent = async (eventId) => {
    if (!currentUser) {
      setNotification({ message: 'Please log in to register for events.', type: 'error' });
      return;
    }

    try {
      const eventRef = doc(db, 'events', eventId);
      await updateDoc(eventRef, {
        numUsers: increment(1),
        registeredUsers: arrayUnion(currentUser.email)
      });
      setNotification({ message: 'נרשמת בהצלחה לאירוע!', type: 'success' });
      setEvents(events.map(event => event.id === eventId ? { ...event, registeredUsers: [...(event.registeredUsers || []), currentUser.email] } : event));
    } catch (error) {
      console.error('Error registering for event:', error);
      setNotification({ message: 'אירעה שגיאה בעת רישום לאירוע. בבקשה נסה שוב מאוחר יותר.', type: 'error' });
    }
  };

  const renderDaysOfWeek = () => (
    <div className="days-of-week">
      {[...daysOfWeek].map(day => (
        <div key={day} className="day-header">
          {day}
        </div>
      ))}
    </div>
  );

  const renderDaysInMonth = () => {
    const daysInMonth = new Date(currentYear, currentMonth + 1, 0).getDate();
    const firstDayOfMonth = new Date(currentYear, currentMonth, 1).getDay();
    const weeks = [[]];

    let currentWeek = 0;
    for (let i = 0; i < firstDayOfMonth; i++) {
      weeks[currentWeek].push(null);
    }

    for (let day = 1; day <= daysInMonth; day++) {
      if (weeks[currentWeek].length === 7) {
        weeks.push([]);
        currentWeek++;
      }
      weeks[currentWeek].push(day);
    }

    // Ensure the last week is correctly filled
    while (weeks[currentWeek].length < 7) {
      weeks[currentWeek].push(null);
    }

    return (
      <div className="days-grid">
        {weeks.map((week, index) => (
          <div key={index} className="calendar-week">
            {week.map((day, dayIndex) => {
              const isToday = day && new Date(currentYear, currentMonth, day).toDateString() === today.toDateString();
              const hasEvent = events.some(event => {
                const eventDate = event.date?.toDate();
                return eventDate &&
                  eventDate.getDate() === day &&
                  eventDate.getMonth() === currentMonth &&
                  eventDate.getFullYear() === currentYear;
              });

              return (
                <div
                  key={dayIndex}
                  className={`calendar-day ${day ? '' : 'day-empty'} ${isToday ? 'today' : ''}`}
                  onClick={() => {
                    if (day) {
                      const selectedDate = new Date(currentYear, currentMonth, day);
                      setSelectedDate(selectedDate);
                      setShowEventForm(false);
                    }
                  }}
                >
                  {day && hasEvent ? (
                    <div className={`event-indicator ${isToday ? 'today' : ''}`}>{day}</div>
                  ) : (
                    <div className={`event-indicator no-event ${isToday ? 'today' : ''}`}>{day}</div>
                  )}
                </div>
              );
            })}
          </div>
        ))}
      </div>
    );
  };

  const handlePrevMonth = () => {
    if (currentMonth === 0) {
      setCurrentMonth(11);
      setCurrentYear(currentYear - 1);
    } else {
      setCurrentMonth(currentMonth - 1);
    }
  };

  const handleNextMonth = () => {
    if (currentMonth === 11) {
      setCurrentMonth(0);
      setCurrentYear(currentYear + 1);
    } else {
      setCurrentMonth(currentMonth + 1);
    }
  };

  const handleToday = () => {
    const today = new Date();
    setSelectedDate(today);
    setCurrentMonth(today.getMonth());
    setCurrentYear(today.getFullYear());
  };

  const selectedDateString = selectedDate ? selectedDate.toLocaleDateString() : '';
  const eventsOnSelectedDate = selectedDate
    ? events.filter(event => {
        const eventDate = event.date?.toDate();
        return (
          eventDate &&
          eventDate.getDate() === selectedDate.getDate() &&
          eventDate.getMonth() === selectedDate.getMonth() &&
          eventDate.getFullYear() === selectedDate.getFullYear()
        );
      })
    : [];

  // Filter events for the current user
  const userRegisteredEvents = events.filter(event =>
    event.registeredUsers?.includes(currentUser?.email)
  );

  return (
    <div className="calendar-container">
      {/* Section for displaying user's registered events */}
      {currentUser && (
        <div className="registered-events">
          <h3>{firstName}, הינה האירועים שהינך רשום אליהם:</h3>
          {userRegisteredEvents.length > 0 ? (
            <ul>
              {userRegisteredEvents.map((event) => (
                <li key={event.id}>
                  <strong>{event.name}</strong> - {event.date?.toDate().toLocaleDateString()}
                </li>
              ))}
            </ul>
          ) : (
            <p>לא מצאנו אירועים שהינך רשום! זה הזמן לעבור על הלוח אירועים ולהרשם</p>
          )}
        </div>
      )}
      <div className="calendar-header">
        <button className="changeMonth-btn" onClick={handlePrevMonth}>&#8249;</button>
        <h2>
          {new Date(currentYear, currentMonth).toLocaleString('default', { month: 'long' })} {currentYear}
        </h2>
        <button className="changeMonth-btn" onClick={handleNextMonth}>&#8250;</button>
        <button className='today-btn' onClick={handleToday}>היום</button>
      </div>
      <div className="calendar-content">
        <div className="calendar-column">
          {renderDaysOfWeek()}
          {renderDaysInMonth()}
        </div>
        <div className="details-column">
          {selectedDate && (
            <div className="event-details-container">
              <h3>{selectedDateString}</h3>
              <div className="actions">
                {isAdmin && (
                  <button
                    className="action-button"
                    onClick={() => { setShowEventForm(true); }}
                  >
                    צור אירוע
                  </button>
                )}
              </div>
              {showEventForm && (
                <div className="event-form">
                  <EventForm
                    selectedDate={selectedDate}
                    handleAddEvent={handleAddEvent}
                    newEvent={newEvent}
                    setNewEvent={setNewEvent}
                    setShowEventForm={setShowEventForm}
                  />
                </div>
              )}
              {eventsOnSelectedDate.length > 0 ? (
                <div className="event-details">
                  <CalendarDay
                    selectedDate={selectedDate}
                    events={eventsOnSelectedDate}
                    handleRegisterForEvent={handleRegisterForEvent}
                    currentUser={currentUser}
                    updateEvents={updateEvents}
                  />
                </div>
              ) : (
                <p>אין אירועים</p>
              )}
            </div>
          )}
        </div>
      </div>
      {notification.message && (
        <Notification
          message={notification.message}
          type={notification.type}
          onClose={() => setNotification({ message: '', type: '' })}
        />
      )}
    </div>
  );
};

export default Calendar;
