import React, { useEffect, useState, useRef } from 'react';
import { db, doc, getDoc } from '../../fireBase/firebase';
import '../../styles/ParticipantList.css';

const ParticipantList = ({ event, participantIds, onClose }) => {
    const [participants, setParticipants] = useState([]);
    const participantListRef = useRef(null);

  useEffect(() => {
    const fetchParticipantData = async () => {
      try {
        const participantData = [];
        for (const participantId of participantIds) {
            
          const userQuerySnapshot =  await getDoc(doc(db, 'users', participantId));
          
          if (!userQuerySnapshot.empty) {
            const userData = userQuerySnapshot.data()
           
            participantData.push({
              firstName: userData.firstName,
              lastName: userData.lastName,
              email: userData.email,
            });
          }
        }
        setParticipants(participantData);
      } catch (error) {
        console.error('Error fetching participant data:', error);
      }
    };

    fetchParticipantData();
  }, [participantIds]);

  const eventDate = event.date?.toDate();
  const eventDateString = eventDate ? eventDate.toLocaleDateString() : '';

  const handlePrint = () => {
    const printContent = participantListRef.current.cloneNode(true);
    const headerElement = printContent.querySelector('.participant-list-header');
    headerElement.remove();
  
    const printWindow = window.open('', '', 'height=600,width=800');
    printWindow.document.write(`
      <html>
        <head>
          <title>Participant List</title>
          <link rel="stylesheet" href="${window.location.origin}/styles/ParticipantList.css" />
        </head>
        <body>
            <p>Event: ${event.name}</p>
            <p>Date: ${eventDateString}</p>
            <p>Start Time: ${event.date.toDate().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })} </p>
          ${printContent.outerHTML}
        </body>
      </html>
    `);

    printWindow.document.close();
    printWindow.focus();
    printWindow.print();
    printWindow.close();
  };



  return (
    <div className="participant-list-overlay">
      <div className={`participant-list-modal ${window.matchMedia('print').matches ? 'print-mode' : ''}`} ref={participantListRef}>
        <div className="participant-list-header">
          <h3>Participant list for the event: {event.name} on {eventDateString}</h3>
          <div>
            <button className="print-button" onClick={handlePrint}>
              Print
            </button>
            <button className="close-button" onClick={onClose}>
              Close
            </button>
          </div>
        </div>
        <div className="participant-list-table">
          <table>
            <thead>
              <tr>
                <th>First Name</th>
                <th>Last Name</th>
                <th>Email</th>
              </tr>
            </thead>
            <tbody>
              {participants.map((participant, index) => (
                <tr key={index}>
                  <td>{participant.firstName}</td>
                  <td>{participant.lastName}</td>
                  <td>{participant.email}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default ParticipantList;