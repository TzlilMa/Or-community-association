// src/pages/homepage.js
import React, { useEffect, useState } from 'react';
import { db, doc, getDoc } from '../fireBase/firebase';
import BulletinBoard from '../components/BulletinBoard';
import { useAuth } from '../fireBase/AuthContext';
import '../styles/Homepage.css';
import photo1 from '../assets/image-hpmepage2.jpeg';
import photo2 from '../assets/images-homepage.jpeg';

const Homepage = () => {
  const { currentUser } = useAuth();
  const [firstName, setFirstName] = useState('');

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        if (!currentUser || !currentUser.email) {
          console.error('Email is not provided.');
          return;
        }

        console.log('Fetching user data for email:', currentUser.email); // Debug log

        const userDoc = await getDoc(doc(db, 'users', currentUser.email));
        if (userDoc.exists()) {
          const userData = userDoc.data();
          console.log('User data:', userData); // Debug log
          setFirstName(userData.firstName);
        } else {
          console.error('User document does not exist for email:', currentUser.email);
        }
      } catch (error) {
        console.error('Error fetching user data:', error);
      }
    };

    fetchUserData();
  }, [currentUser]);

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
