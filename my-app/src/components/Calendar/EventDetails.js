import React, { useState, useEffect } from 'react';
import { db, doc, updateDoc, getDoc, increment } from '../../fireBase/firebase'; // Import Firebase functions

const EventDetails = ({ event, currentUser, handleRegisterForEvent }) => {
  const [isRegistered, setIsRegistered] = useState(false);

  useEffect(() => {
    // Check if the current user is registered for the event
    if (event.registeredUsers && event.registeredUsers.includes(currentUser.email)) {
      setIsRegistered(true);
    } else {
      setIsRegistered(false);
    }
  }, [event, currentUser]);

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

  return (
    <div className="event-details">
      <h4>{event.name}</h4>
      <p>איפה?  {event.location}</p>
      <p>שעה {event.date?.toDate().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })} </p>
      <p>{event.description}</p>
      {isRegistered ? (
        <div>
          <p>רשום</p>
          <button onClick={handleRegisterClick}>בטל רישום לאירוע</button>
        </div>
      ) : (
        <button onClick={handleRegisterClick}>תרשום אותי</button>
      )}
    </div>
  );
};

export default EventDetails;
