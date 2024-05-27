import React, { useEffect, useState } from 'react';
import { useLocation } from 'react-router-dom';
import { db, doc, getDoc } from '../fireBase/firebase'; // Adjust the import path as needed
import Header from '../components/Header'; // Import the Header component

const Homepage = () => {
  const location = useLocation();
  const { email } = location.state || {}; // Access email from the state
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
          setFirstName(userData.firstName); // Assuming 'firstName' is the field name in the user document
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
    <div>
      <Header user={{ firstName }} /> {/* Pass the user information to the Header component */}
      <div className="personal-area-content">
        
      </div>
    </div>
  );
};

export default Homepage;
