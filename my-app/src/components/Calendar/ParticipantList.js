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
                    const userQuerySnapshot = await getDoc(doc(db, 'users', participantId));
                    if (userQuerySnapshot.exists()) {
                        const userData = userQuerySnapshot.data();
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
  
      const participantRows = participants.map((participant, index) => `
          <tr>
              <td>${index + 1}</td>
              <td>${participant.firstName}</td>
              <td>${participant.lastName}</td>
              <td>${participant.email}</td>
          </tr>
      `).join('');
  
      const printWindow = window.open('', '', 'height=600,width=800');
      printWindow.document.write(`
                  <html>
            <head>
                <title>רשימת משתתפים</title>
                <link rel="stylesheet" href="${window.location.origin}/styles/ParticipantList.css" />
                <style>
                    body {
                        direction: rtl;
                        text-align: right;
                        font-family: Arial, sans-serif;
                    }
                    .event-details {
                        margin-bottom: 20px;
                    }
                    table {
                        width: 100%;
                        border-collapse: collapse;
                    }
                    th, td {
                        padding: 8px;
                        border: 1px solid #ddd;
                        text-align: center;
                    }
                    th {
                        background-color: #f2f2f2;
                    }
                    tr:nth-child(even) {
                        background-color: #f9f9f9;
                    }
                </style>
            </head>
            <body>
                <div class="event-details">
                    <p>אירוע: ${event.name}</p>
                    <p>תאריך: ${eventDateString}</p>
                    <p>שעת התחלה: ${event.date.toDate().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</p>
                </div>
                <table>
                    <thead>
                        <tr>
                            <th>#</th>
                            <th>שם פרטי</th>
                            <th>שם משפחה</th>
                            <th>דואר אלקטרוני</th>
                        </tr>
                    </thead>
                    <tbody>
                        ${participantRows}
                    </tbody>
                </table>
            </body>
        </html>
        `);

        printWindow.document.close();
        printWindow.focus();

        setTimeout(() => {
            printWindow.print();
            printWindow.close();
        }, 500);
    };

    return (
        <div className="participant-list-overlay">
            <div className={`participant-list-modal ${window.matchMedia('print').matches ? 'print-mode' : ''}`} ref={participantListRef}>
                <div className="participant-list-header">
                    <h3>רשימת משתתפים לאירוע {event.name} בתאריך {eventDateString}</h3>
                    <div>
                        <button className="print-button" onClick={handlePrint}>
                            הדפס רשימה
                        </button>
                        <button className="close-button" onClick={onClose}>
                            סגור חלון
                        </button>
                    </div>
                </div>
                <div className="participant-list-table">
                    <table>
                        <thead>
                            <tr>
                                <th>#</th>
                                <th>שם פרטי</th>
                                <th>שם משפחה</th>
                                <th>דואר אלקטרוני</th>
                            </tr>
                        </thead>
                        <tbody>
                            {participants.map((participant, index) => (
                                <tr key={index}>
                                    <td>{index + 1}</td>
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
