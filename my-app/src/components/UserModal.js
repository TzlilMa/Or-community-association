import React, { useState, useEffect } from 'react';
import { db, doc, getDoc } from '../fireBase/firebase';
import '../styles/UserModal.css';

const UserModal = ({ email, onClose }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const userDoc = await getDoc(doc(db, 'users', email));
        if (userDoc.exists()) {
          setUser(userDoc.data());
          console.log("User data fetched:", userDoc.data()); // Debug log
        } else {
          console.error('No such user!');
        }
      } catch (error) {
        console.error('Error fetching user data:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchUser();
  }, [email]);

  if (loading) return <div>Loading...</div>;
  if (!user) return <div>No user data found.</div>;

  return (
    <div className="modal-overlay">
      <div className="modal">
        <button onClick={onClose} className="close-button">X</button>
        <h2>User Information</h2>
        <table>
          <tbody>
            <tr>
              <th>Email</th>
              <td>{user.email}</td>
            </tr>
            <tr>
              <th>First Name</th>
              <td>{user.firstName}</td>
            </tr>
            <tr>
              <th>Last Name</th>
              <td>{user.lastName}</td>
            </tr>
            <tr>
              <th>Date of Birth</th>
              <td>{user.dateOfBirth}</td>
            </tr>
            <tr>
              <th>Gender</th>
              <td>{user.gender}</td>
            </tr>
            <tr>
              <th>Is Admin</th>
              <td>{user.isAdmin ? 'Yes' : 'No'}</td>
            </tr>
            <tr>
              <th>Is Story Public</th>
              <td>{user.isStoryPublic ? 'Yes' : 'No'}</td>
            </tr>
            <tr>
              <th>Personal Story</th>
              <td>{user.personalStory}</td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default UserModal;
