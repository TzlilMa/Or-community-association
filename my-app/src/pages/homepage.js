// src/pages/homepage.js
import React, { useEffect, useState } from 'react';
import { useLocation } from 'react-router-dom';
import { db, doc, getDoc } from '../fireBase/firebase';
import Header from '../components/Header';
import Footer from '../components/Footer';
import '../styles/Homepage.css';

const Homepage = () => {
  const location = useLocation();
  const { email } = location.state || {};
  const [firstName, setFirstName] = useState('');

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        if (!email) {
          console.error('Email is not provided.');
          return;
        }

        const userDoc = await getDoc(doc(db, 'users', email));
        if (userDoc.exists()) {
          const userData = userDoc.data();
          setFirstName(userData.firstName);
        } else {
          console.error('User document does not exist.');
        }
      } catch (error) {
        console.error('Error fetching user data:', error);
      }
    };

    fetchUserData();
  }, [email]);

  return (
    <div className="App">
      <Header />
        <div className="homepage">
          <h1>Homepage Component</h1>
          <p>Welcome, {firstName || email}</p>
        </div>
      <Footer />
    </div>
  );
};

export default Homepage;
