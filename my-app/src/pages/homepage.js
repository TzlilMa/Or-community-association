import React, { useEffect, useState } from 'react';
import { useLocation } from 'react-router-dom';
import { db, doc, getDoc } from '../fireBase/firebase';
import Header from '../components/Header';
import PersonalArea from '../components/PeronalArea';

const Homepage = () => {
  const location = useLocation();
  const { email } = location.state || {};
  const [firstName, setFirstName] = useState('');
  const [activeComponent, setActiveComponent] = useState(null);

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

  const handleComponentChange = (componentName) => {
    setActiveComponent(componentName);
  };

  return (
    <div>
      <Header user={{ firstName }} onComponentChange={handleComponentChange} />
      <div className="personal-area-content">
        {activeComponent === 'PersonalArea' && <PersonalArea />}
        {/* Add more components as needed */}
      </div>
    </div>
  );
};

export default Homepage;
