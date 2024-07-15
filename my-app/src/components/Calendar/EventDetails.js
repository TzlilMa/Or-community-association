import React, { useState, useEffect } from 'react';
import { db, doc, updateDoc, getDoc, increment, getDocs, query, collection, where, deleteDoc } from '../../fireBase/firebase';
import ParticipantList from './ParticipantList';
import EventEditForm from './EventEditForm';
import Notification from '../General/Notification';
import generateICS from '../../utilis/generateICS'; // import the generateICS function
import '../../styles/EventDetails.css';

const EventDetails = ({ event, currentUser, handleRegisterForEvent, updateEvents }) => {
  const [isRegistered, setIsRegistered] = useState(false);
  const [isAdmin, setIsAdmin] = useState(false);
  const [showParticipantList, setShowParticipantList] = useState(false);
  const [showEditForm, setShowEditForm] = useState(false);
  const [notification, setNotification] = useState({ message: '', type: '' });
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (event.registeredUsers && event.registeredUsers.includes(currentUser.email)) {
      setIsRegistered(true);
    } else {
      setIsRegistered(false);
    }

    const fetchUserData = async () => {
      try {
        const userQuerySnapshot = await getDocs(query(collection(db, 'users'), where('email', '==', currentUser.email)));
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

    fetchUserData();
  }, [event, currentUser, isAdmin]);

  const handleRegisterClick = () => {
    if (isRegistered) {
      handleCancelRegistration(event.id);
    } else {
      handleRegisterForEvent(event.id);
    }
  };

  const handleCancelRegistration = async (eventId) => {
    if (loading) return;
    setLoading(true);

    try {
      const eventRef = doc(db, 'events', eventId);
      const eventSnapshot = await getDoc(eventRef);
      const eventData = eventSnapshot.data();

      if (eventData && eventData.registeredUsers) {
        const updatedRegisteredUsers = eventData.registeredUsers.filter(email => email !== currentUser.email);
        await updateDoc(eventRef, { registeredUsers: updatedRegisteredUsers });
        setIsRegistered(false);
      }

      if (eventData.numUsers > 0) {
        await updateDoc(eventRef, {
          numUsers: increment(-1),
        });
      }

      updateEvents();
      setNotification({ message: 'ההרשמה בוטלה בהצלחה!', type: 'success' });
    } catch (error) {
      setNotification({ message: 'אירעה שגיאה בעת ביטול הרישום. בבקשה נסה שוב מאוחר יותר.', type: 'error' });
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteEvent = async () => {
    try {
      await deleteDoc(doc(db, "events", event.id));
      updateEvents();
      setNotification({ message: 'האירוע נמחק בהצלחה!', type: 'success' });
    } catch (error) {
      console.error('Error deleting event:', error);
      setNotification({ message: 'אירעה שגיאה בעת מחיקת האירוע. בבקשה נסה שוב מאוחר יותר.', type: 'error' });
    }
  };

  const handleEditEvent = () => {
    setShowEditForm(true);
  };

  const handleCloseEditForm = () => {
    setShowEditForm(false);
  };

  const handleSubmitEditForm = async (updatedEvent) => {
    try {
      const eventRef = doc(db, 'events', event.id);
      await updateDoc(eventRef, updatedEvent);
      setNotification({ message: 'האירוע עודכן בהצלחה!', type: 'success' });
      updateEvents();
      setShowEditForm(false);
    } catch (error) {
      console.error('Error updating event:', error);
      setNotification({ message: 'אירעה שגיאה בעת עדכון האירוע. בבקשה נסה שוב מאוחר יותר.', type: 'error' });
    }
  };

  const handleShowParticipants = () => {
    setShowParticipantList(true);
  };

  const handleCloseParticipantList = () => {
    setShowParticipantList(false);
  };

  const isPastEvent = event.date?.toDate() < new Date();

  return (
    <div className="event-details">
      <h4>{event.name}</h4>
      <p>מקום: {event.location}</p>
      <p>שעה: {event.date?.toDate().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</p>
      <p>{event.description}</p>
      {isAdmin && (
        <div className="admin-actions-event-detail">
          <button className="admin-delete-detail-btn" onClick={handleDeleteEvent}>
            מחק אירוע
          </button>
          <button className="admin-event-detail-btn" onClick={handleEditEvent}>
            ערוך אירוע
          </button>
          <button className="admin-event-detail-btn" onClick={handleShowParticipants}>
            הצג רשימת משתתפים
          </button>
        </div>
      )}
      {!isPastEvent ? (
        isRegistered ? (
          <div>
            <p>רשום</p>
            <button onClick={handleRegisterClick}>בטל רישום לאירוע</button>
          </div>
        ) : (
          <button onClick={handleRegisterClick}>תרשום אותי</button>
        )
      ) : (
        <p className="event-past-message">האירוע כבר התרחש</p>
      )}
      <button className="add-to-calendar-btn" onClick={() => generateICS(event)}>הוסף אירוע ליומן</button> {/* Add to Calendar button */}
      {showParticipantList && (
        <ParticipantList
          event={event}
          participantIds={event.registeredUsers}
          onClose={handleCloseParticipantList}
        />
      )}
      {showEditForm && (
        <EventEditForm
          event={event}
          onSubmit={handleSubmitEditForm}
          onCancel={handleCloseEditForm}
        />
      )}
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

export default EventDetails;
