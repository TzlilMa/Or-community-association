import React, { useState, useEffect } from 'react';
import { db, doc, updateDoc, getDoc, increment, getDocs, query, collection, where, deleteDoc } from '../../fireBase/firebase'; // Import Firebase functions
import ParticipantList from './ParticipantList';
import EventEditForm from './EventEditForm';
import '../../styles/EventDetails.css';

const EventDetails = ({ event, currentUser, handleRegisterForEvent, updateEvents }) => {
  const [isRegistered, setIsRegistered] = useState(false);
  const [isAdmin, setIsAdmin] = useState(false);
  const [showParticipantList, setShowParticipantList] = useState(false);
  const [showEditForm, setShowEditForm] = useState(false);

  useEffect(() => {
    // Check if the current user is registered for the event
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
      // If the user is already registered, handle cancellation
      handleCancelRegistration(event.id);
    } else {
      // Otherwise, handle registration
      handleRegisterForEvent(event.id);
    }
  };

  const handleCancelRegistration = async (eventId) => {
    try {
      // Get a reference to the event document in Firestore
      const eventRef = doc(db, 'events', eventId);
  
      // Fetch the current event data
      const eventSnapshot = await getDoc(eventRef);
      const eventData = eventSnapshot.data();
  
      // If the event data and registeredUsers array exist
      if (eventData && eventData.registeredUsers) {
        // Remove the current user's email from the registeredUsers array
        const updatedRegisteredUsers = eventData.registeredUsers.filter(email => email !== currentUser.email);
  
        // Update the event document with the new registeredUsers array
        await updateDoc(eventRef, { registeredUsers: updatedRegisteredUsers });
  
        // Optionally, update the local state to reflect the cancellation
        setIsRegistered(false);
      }
      
      // Decrement the numUsers field by 1
      await updateDoc(eventRef, {
        numUsers: increment(-1),
      });
      
      // Notify the user that registration has been cancelled successfully
      alert('Registration cancelled successfully!');
    } catch (error) {
      console.error('Error cancelling registration:', error);
      alert('An error occurred while cancelling registration. Please try again later.');
    }
  };

  const handleDeleteEvent = async () => {
    try {
      await deleteDoc(doc(db, "events", event.id));
      // Call the updateEvents function after successful deletion
      updateEvents();
      alert('Event deleted successfully!');
    } catch (error) {
      console.error('Error deleting event:', error);
      alert('An error occurred while deleting the event. Please try again later.');
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
      alert('Event updated successfully!');
      updateEvents(); // Update the events list
      setShowEditForm(false);
    } catch (error) {
      console.error('Error updating event:', error);
      alert('An error occurred while updating the event. Please try again later.');
    }
  };

  const handleShowParticipants = () => {
    setShowParticipantList(true);
  };

  const handleCloseParticipantList = () => {
    setShowParticipantList(false);
  };


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
      {!isAdmin && (
        isRegistered ? (
          <div>
            <p>רשום</p>
            <button onClick={handleRegisterClick}>בטל רישום לאירוע</button>
          </div>
        ) : (
          <button onClick={handleRegisterClick}>תרשום אותי</button>
        )
      )}
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
    </div>
  );
};

export default EventDetails;
