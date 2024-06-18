// src/components/PersonalArea.js
import React, { useEffect, useState } from 'react';
import { db, doc, getDoc, setDoc } from '../fireBase/firebase'; // Adjust the import path as needed
import '../styles/PersonalArea.css'; // Ensure this path is correct

const PersonalArea = ({ username }) => {
  const [userData, setUserData] = useState({
    firstName: '',
    lastName: '',
    age: '',
    sex: '',
    personalStory: '',
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const userDoc = await getDoc(doc(db, 'users', username));
        if (userDoc.exists()) {
          setUserData(userDoc.data());
        } else {
          console.error('User document does not exist.');
        }
      } catch (error) {
        console.error('Error fetching user data:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchUserData();
  }, [username]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setUserData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await setDoc(doc(db, 'users', username), userData, { merge: true });
      alert('User information updated successfully.');
    } catch (error) {
      console.error('Error updating user information:', error);
      alert('Failed to update user information.');
    }
  };

  if (loading) {
    return <div>Loading...</div>;
  }

  return (
        <form className="user-form" onSubmit={handleSubmit}>
          <div className="form-group">
            <label htmlFor="firstName">First Name:</label>
            <input
              type="text"
              id="firstName"
              name="firstName"
              value={userData.firstName}
              onChange={handleChange}
              required
            />
          </div>
          <div className="form-group">
            <label htmlFor="lastName">Last Name:</label>
            <input
              type="text"
              id="lastName"
              name="lastName"
              value={userData.lastName}
              onChange={handleChange}
              required
            />
          </div>
          <div className="form-group">
            <label htmlFor="personalStory">Personal Story:</label>
            <textarea
              id="personalStory"
              name="personalStory"
              value={userData.personalStory}
              onChange={handleChange}
            ></textarea>
          </div>
          <button type="submit">Update Information</button>
        </form>
  );
};

export default PersonalArea;
