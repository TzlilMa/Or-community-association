import React, { useState, useEffect } from 'react';
import { db, doc, getDoc } from '../../fireBase/firebase';
import '../../styles/UserModal.css';

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
    <div className="userModalAdmin">
      <div className="modal-showUser-Admin">
        <button onClick={onClose} className="close-button-user-modal">X</button>
        <h2>פרטי משתמש</h2>
        <table>
          <tbody>
            <tr>
              <th>Email</th>
              <td>{user.email}</td>
            </tr>
            <tr>
              <th>שם פרטי</th>
              <td>{user.firstName}</td>
            </tr>
            <tr>
              <th>שם משפחה</th>
              <td>{user.lastName}</td>
            </tr>
            <tr>
              <th>תאריך לידה</th>
              <td>{user.dateOfBirth} ({user.age})</td>
            </tr>
            <tr>
              <th>מגדר</th>
              <td>{user.gender}</td>
            </tr>
            <tr>
              <th>מנהל</th>
              <td>{user.isAdmin ? 'כן' : 'לא'}</td>
            </tr>
            <tr>
              <th>מאשר לפרסם סיפור</th>
              <td>{user.isStoryPublic ? 'כן' : 'לא'}</td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default UserModal;
