import React, { useEffect, useState } from 'react';
import { db, doc, getDoc, setDoc } from '../fireBase/firebase'; // Adjust the import path as needed
import '../styles/UserForm.css'; // Import the CSS file for styling the form

const UserForm = ({ username }) => {
  const [userData, setUserData] = useState({
    firstName: '',
    lastName: '',
    age: '',
    sex: '',
    personalStory: '',
    // Add other fields as needed
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
        <label htmlFor="age">Age:</label>
        <input
          type="number"
          id="age"
          name="age"
          value={userData.age}
          onChange={handleChange}
        />
      </div>
      <div className="form-group">
        <label htmlFor="Gendar">Gendar:</label>
        <select
          id="sex"
          name="sex"
          value={userData.sex}
          onChange={handleChange}
        >
          <option value="">Select...</option>
          <option value="Male">Male</option>
          <option value="Female">Female</option>
          <option value="Other">Other</option>
        </select>
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

export default UserForm;
