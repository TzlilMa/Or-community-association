import React, { useEffect, useState } from 'react';
import { Bar } from 'react-chartjs-2';
import { Chart, registerables } from 'chart.js';
import { db, collection, getDocs } from '../../fireBase/firebase.js';
import { useNavigate } from 'react-router-dom';
import '../../styles/Reports.css';

Chart.register(...registerables);

const Reports = () => {
  const [ageData, setAgeData] = useState(null);
  const [inquiryWithoutResponseData, setInquiryWithoutResponseData] = useState(null);
  const [inquiryWithResponseData, setInquiryWithResponseData] = useState(null);
  const [averageResponseTimeData, setAverageResponseTimeData] = useState(null);
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true); // Loading state
  const navigate = useNavigate();

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
        const responseTimes = {};
        const responseCounts = {};
        const eventList = [];
        const subjects = [];

        inquirySubjectsSnapshot.forEach(doc => {
          const subjectData = doc.data();
          subjects.push(subjectData.name);
          inquiriesWithoutResponseCount[subjectData.name] = 0;
          inquiriesWithResponseCount[subjectData.name] = 0;
          responseTimes[subjectData.name] = 0;
          responseCounts[subjectData.name] = 0;
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
          const submittedAt = new Date(inquiry.submitDate);
          const respondedAt = new Date(inquiry.responseDate);

          if (subjects.includes(subject)) {
            if (response.trim() === '') {
              inquiriesWithoutResponseCount[subject]++;
            } else {
              inquiriesWithResponseCount[subject]++;
              if (submittedAt && respondedAt) {
                const responseTime = (respondedAt - submittedAt) / (1000 * 60 * 60); // difference in hours
                responseTimes[subject] += responseTime;
                responseCounts[subject]++;
              }
            }
          }
        });

        eventsSnapshot.forEach(doc => {
          const event = doc.data();
          eventList.push({
            name: event.name,
            date: event.date.toDate().toLocaleDateString(),
            registrations: event.numUsers || 0, // Use numUsers column
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

        setAverageResponseTimeData({
          labels: subjects,
          datasets: [
            {
              label: 'זמן תגובה ממוצע (שעות)',
              data: subjects.map(subject => responseCounts[subject] ? (responseTimes[subject] / responseCounts[subject]).toFixed(2) : 0),
              backgroundColor: 'rgba(153, 102, 255, 0.6)',
            },
          ],
        });

        setEvents(eventList);
      } catch (error) {
        console.error('Error fetching data:', error);
      } finally {
        setLoading(false); // Set loading to false after data is fetched
      }
    };

    fetchData();
  }, []);

  const handleFetchUsersClick = () => {
    navigate('/accountspanel');
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

  const optionsAverageResponseTime = {
    responsive: true,
    plugins: {
      legend: {
        display: false,
      },
      title: {
        display: true,
        text: 'זמן תגובה ממוצע לפי נושא (שעות)',
        font: {
          size: 20,
        },
      },
    },
  };

  return (
    <div className="reports-container">
      <div className="button-container">
        <button className="fetch-users-button" onClick={handleFetchUsersClick}>ניהול משתמשים</button>
      </div>
      {loading ? (
        <div className="spinner-container">
          <div className="spinner"></div>
        </div>
      ) : (
        <div className="charts-container">
          <div className="chart">
            {ageData ? <Bar data={ageData} options={optionsAge} /> : <p>Loading age data...</p>}
          </div>
          <div className="chart">
            {inquiryWithoutResponseData ? <Bar data={inquiryWithoutResponseData} options={optionsWithoutResponse} /> : <p>Loading inquiry data...</p>}
          </div>
          <div className="chart">
            {inquiryWithResponseData ? <Bar data={inquiryWithResponseData} options={optionsWithResponse} /> : <p>Loading inquiry data...</p>}
          </div>
          <div className="chart">
            {averageResponseTimeData ? <Bar data={averageResponseTimeData} options={optionsAverageResponseTime} /> : <p>Loading average response time data...</p>}
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
                    <td colSpan="3">לא נמצאו אירועים</td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
};

export default Reports;
