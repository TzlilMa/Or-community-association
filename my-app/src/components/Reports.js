// src/components/Reports.js
import React, { useEffect, useState, useRef } from 'react';
import { Bar } from 'react-chartjs-2';
import { Chart, registerables } from 'chart.js';
import { db, collection, getDocs } from '../fireBase/firebase';
import '../styles/Reports.css';
import '../styles/ParticipantList.css'; // Import the ParticipantList styles

// Register all necessary Chart.js components
Chart.register(...registerables);

const Reports = () => {
  const [ageData, setAgeData] = useState(null);
  const [inquiryWithoutResponseData, setInquiryWithoutResponseData] = useState(null);
  const [inquiryWithResponseData, setInquiryWithResponseData] = useState(null);
  const [events, setEvents] = useState([]);
  const [users, setUsers] = useState([]);
  const [showUsersModal, setShowUsersModal] = useState(false);
  const usersListRef = useRef(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const usersSnapshot = await getDocs(collection(db, 'users'));
        const inquiriesSnapshot = await getDocs(collection(db, 'inquiry'));
        const inquirySubjectsSnapshot = await getDocs(collection(db, 'inquirySubject'));
        const eventsSnapshot = await getDocs(collection(db, 'events'));

        const ageRanges = Array(5).fill(0);
        const inquiriesWithoutResponseCount = {};
        const inquiriesWithResponseCount = {};
        const eventList = [];
        const subjects = [];

        // Initialize subjects from inquirySubject collection
        inquirySubjectsSnapshot.forEach(doc => {
          const subjectData = doc.data();
          subjects.push(subjectData.name);
          inquiriesWithoutResponseCount[subjectData.name] = 0;
          inquiriesWithResponseCount[subjectData.name] = 0;
        });

        usersSnapshot.forEach(doc => {
          const user = doc.data();
          const age = user.age;
          if (age <= 20) ageRanges[0]++;
          else if (age <= 40) ageRanges[1]++;
          else if (age <= 60) ageRanges[2]++;
          else if (age <= 80) ageRanges[3]++;
          else ageRanges[4]++;
        });

        inquiriesSnapshot.forEach(doc => {
          const inquiry = doc.data();
          const subject = inquiry.subject;
          const response = inquiry.response || '';

          if (subjects.includes(subject)) {
            if (response.trim() === '') {
              inquiriesWithoutResponseCount[subject]++;
            } else {
              inquiriesWithResponseCount[subject]++;
            }
          }
        });

        eventsSnapshot.forEach(doc => {
          const event = doc.data();
          eventList.push({
            name: event.name,
            date: event.date.toDate().toLocaleDateString(), // Convert Firestore timestamp to readable date
            registrations: event.registrations || 0,
          });
        });

        setAgeData({
          labels: ['0-20', '21-40', '41-60', '61-80', '81-100'],
          datasets: [
            {
              label: 'מספר משתתפים',
              data: ageRanges,
              backgroundColor: 'rgba(75, 192, 192, 0.6)',
            },
          ],
        });

        setInquiryWithoutResponseData({
          labels: subjects,
          datasets: [
            {
              label: 'פניות ללא תגובה',
              data: subjects.map(subject => inquiriesWithoutResponseCount[subject]),
              backgroundColor: 'rgba(255, 99, 132, 0.6)',
            },
          ],
        });

        setInquiryWithResponseData({
          labels: subjects,
          datasets: [
            {
              label: 'פניות עם תגובה',
              data: subjects.map(subject => inquiriesWithResponseCount[subject]),
              backgroundColor: 'rgba(54, 162, 235, 0.6)',
            },
          ],
        });

        setEvents(eventList);
      } catch (error) {
        console.error('Error fetching data:', error);
      }
    };

    fetchData();
  }, []);

  const fetchUsers = async () => {
    try {
      const usersSnapshot = await getDocs(collection(db, 'users'));
      const userData = usersSnapshot.docs.map(doc => doc.data());
      setUsers(userData);
      setShowUsersModal(true);
    } catch (error) {
      console.error('Error fetching users:', error);
    }
  };

  const handlePrintUsers = () => {
    const printContent = usersListRef.current.cloneNode(true);
    const headerElement = printContent.querySelector('.participant-list-header');
    headerElement.remove();

    const printWindow = window.open('', '', 'height=600,width=800');
    printWindow.document.write(`
      <html>
        <head>
          <title>User List</title>
          <link rel="stylesheet" href="${window.location.origin}/styles/ParticipantList.css" />
        </head>
        <body>
          ${printContent.outerHTML}
        </body>
      </html>
    `);

    printWindow.document.close();
    printWindow.focus();
    printWindow.print();
    printWindow.close();
  };

  const optionsWithoutResponse = {
    responsive: true,
    plugins: {
      legend: {
        display: false,
      },
      title: {
        display: true,
        text: 'מספר פניות ללא תגובה',
        font: {
          size: 20,
        },
      },
    },
  };

  const optionsWithResponse = {
    responsive: true,
    plugins: {
      legend: {
        display: false,
      },
      title: {
        display: true,
        text: 'מספר פניות עם תגובה',
        font: {
          size: 20,
        },
      },
    },
  };

  const optionsAge = {
    responsive: true,
    plugins: {
      legend: {
        display: false,
      },
      title: {
        display: true,
        text: 'מספר משתמשים לפי טווח גילאים',
        font: {
          size: 20,
        },
      },
    },
  };

  return (
    <div className="reports-container">
      <div className="charts-container">
        <div className="chart">
          {inquiryWithoutResponseData ? <Bar data={inquiryWithoutResponseData} options={optionsWithoutResponse} /> : <p>Loading inquiry data...</p>}
        </div>
        <div className="chart">
          {ageData ? <Bar data={ageData} options={optionsAge} /> : <p>Loading age data...</p>}
        </div>
        <div className="chart">
          {inquiryWithResponseData ? <Bar data={inquiryWithResponseData} options={optionsWithResponse} /> : <p>Loading inquiry data...</p>}
        </div>
        <div className="table-container">
          <table>
            <thead>
              <tr>
                <th>שם אירוע</th>
                <th>תאריך אירוע</th>
                <th>מספר משתתפים</th>
              </tr>
            </thead>
            <tbody>
              {events.length > 0 ? (
                events.map((event, index) => (
                  <tr key={index}>
                    <td>{event.name}</td>
                    <td>{event.date}</td>
                    <td>{event.registrations}</td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="3">No events found</td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
      <div className="button-container">
        <button className="fetch-users-button" onClick={fetchUsers}>רשימת משתתפים</button>
      </div>
      {showUsersModal && (
        <div className="participant-list-overlay">
          <div className="participant-list-modal" ref={usersListRef} style={{ direction: 'rtl' }}>
            <div className="participant-list-header">
              <h3>רשימת משתמשים</h3>
              <div className="button-group">
                <button className="print-button" onClick={handlePrintUsers}>שמור</button>
                <button className="close-button" onClick={() => setShowUsersModal(false)}>סגור</button>
              </div>
            </div>
            <div className="participant-list-table">
              <table>
                <thead>
                  <tr>
                    <th>שם פרטי</th>
                    <th>שם משפחה</th>
                    <th>כתובת מייל</th>
                  </tr>
                </thead>
                <tbody>
                  {users.map((user, index) => (
                    <tr key={index}>
                      <td style={{ direction: 'rtl' }}>{user.firstName}</td>
                      <td style={{ direction: 'rtl' }}>{user.lastName}</td>
                      <td>{user.email}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Reports;
