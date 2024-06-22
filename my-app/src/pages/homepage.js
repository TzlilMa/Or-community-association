// src/pages/homepage.js
import React, { useEffect, useState } from 'react';
import { useLocation } from 'react-router-dom';
import { db, doc, getDoc } from '../fireBase/firebase';
import BulletinBoard from '../components/BulletinBoard';
import '../styles/Homepage.css';
import photo1 from '../assets/image-hpmepage2.jpeg';
import photo2 from '../assets/images-homepage.jpeg'; 


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
      <div className="homepage">
        <div className="main-content">
          <h1>"לעיתים צריכים רק אור קטן בשביל לעשות שינוי גדול"</h1>
          <div className="photos-container">
            <img src={photo1} alt="Description of photo 1" className="photo" />
            <img src={photo2} alt="Description of photo 2" className="photo" />
          </div>
        </div>
        <BulletinBoard />
      </div>
    </div>
  );
};

export default Homepage;
