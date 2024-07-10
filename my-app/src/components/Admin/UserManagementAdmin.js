import React, { useState, useEffect, useCallback } from 'react';
import axios from 'axios';
import UserModal from './UserModalAdmin';
import '../../styles/UserManagement.css';
import Notification from '../General/Notification';
import { getFirestore, getDocs, collection, updateDoc, doc, query, where } from 'firebase/firestore';

const UserManagement = () => {
  const db = getFirestore();
  const [users, setUsers] = useState([]);
  const [filteredUsers, setFilteredUsers] = useState([]);
  const [search, setSearch] = useState('');
  const [sortField, setSortField] = useState('creationTime');
  const [sortOrder, setSortOrder] = useState('asc');
  const [selectedEmail, setSelectedEmail] = useState(null);
  const [notification, setNotification] = useState({ message: '', type: '' });

  const getFirestoreUsers = useCallback(async () => {
    const usersSnapshot = await getDocs(collection(db, 'users'));
    return usersSnapshot.docs.map(doc => ({
      email: doc.id, // Assuming the document ID is the user's email
      isAdmin: doc.data().isAdmin,
    }));
  }, [db]);

  const fetchUsers = useCallback(async () => {
    try {
      const response = await axios.get('/api/users');
      const apiUsers = response.data;

      const firestoreUsers = await getFirestoreUsers();

      const usersList = apiUsers.map(apiUser => {
        const firestoreUser = firestoreUsers.find(user => user.email === apiUser.email);
        return {
          ...apiUser,
          ...firestoreUser,
        };
      });

      setUsers(usersList);
      setFilteredUsers(usersList);
    } catch (error) {
      console.error('Error fetching users:', error);
    }
  }, [getFirestoreUsers]);

  useEffect(() => {
    fetchUsers();
  }, [fetchUsers]);

  const handleSearch = (e) => {
    const value = e.target.value.toLowerCase();
    setSearch(value);
    const filtered = users.filter(user => user.email.toLowerCase().includes(value));
    setFilteredUsers(filtered);
  };

  const handleSort = (field) => {
    const order = sortField === field && sortOrder === 'asc' ? 'desc' : 'asc';
    setSortField(field);
    setSortOrder(order);
    const sorted = [...filteredUsers].sort((a, b) => {
      if (a[field] < b[field]) return order === 'asc' ? -1 : 1;
      if (a[field] > b[field]) return order === 'asc' ? 1 : -1;
      return 0;
    });
    setFilteredUsers(sorted);
  };

  const handleChangeAccountStatus = async (userId, currentStatus) => {
    try {
      const newStatus = currentStatus === 'active' ? 'inactive' : 'active';
      await axios.patch(`/api/user/${userId}`, { status: newStatus });
      fetchUsers(); // Refresh the list of users
    } catch (error) {
      console.error('Error changing account status:', error);
    }
  };

  const handleShowChatLog = (email) => {
    const chatLogUrl = `/chat-log/${encodeURIComponent(email)}`;
    window.open(chatLogUrl, '_blank');
  };

  const handleShowUser = (email) => {
    setSelectedEmail(email);
  };

  const handleCloseUserModal = () => {
    setSelectedEmail(null);
  };

  const handleSetAdmin = async (email) => {
    try {
      const userRef = doc(db, 'users', email);
      await updateDoc(userRef, { isAdmin: true });
      fetchUsers(); // Refresh the list of users
      setNotification({ message: 'המשתמש נקבע כמנהל בהצלחה.', type: 'success' });
    } catch (error) {
      console.error('Error setting admin:', error.code, error.message); // Log more details
    }
  };

  const handleRemoveAdmin = async (email) => {
    try {
      // Check if there's at least one other admin
      const adminQuery = query(collection(db, 'users'), where('isAdmin', '==', true));
      const adminSnapshot = await getDocs(adminQuery);
      if (adminSnapshot.size > 1) { // Ensure there's at least one admin left
        const userRef = doc(db, 'users', email);
        await updateDoc(userRef, { isAdmin: false });
        fetchUsers(); // Refresh the list of users
        setNotification({ message: 'הרשאות הניהול הוסרו מהמשתמש בהצלחה.', type: 'success' });
      } else {
        setNotification({ message: 'לא ניתן לבטל הרשאות ניהול ממשתמש זה. יש לוודא שיש לפחות מנהל אחד נוסף.', type: 'error' });
      }
    } catch (error) {
      console.error('Error removing admin:', error);
    }
  };

  const formatDate = (dateString) => {
    if (!dateString) return 'N/A';
    return new Date(dateString).toLocaleDateString();
  };

  return (
    <div className="user-management">
      <h2>ניהול משתמשים</h2>
      <input
        type="text"
        placeholder="חפש לפי אימייל"
        value={search}
        onChange={handleSearch}
        className="search-input"
      />
      <table>
        <thead>
          <tr>
            <th onClick={() => handleSort('email')}>אימייל</th>
            <th onClick={() => handleSort('creationTime')}>תאריך הרשמה</th>
            <th onClick={() => handleSort('lastSignInTime')}>תאריך כניסה אחרון</th>
            <th onClick={() => handleSort('disabled')}>סטטוס חשבון</th>
            <th>פעולות</th>
          </tr>
        </thead>
        <tbody>
          {filteredUsers.map(user => (
            <tr key={user.uid}>
              <td>{user.email}</td>
              <td>{formatDate(user.creationTime)}</td>
              <td>{formatDate(user.lastSignInTime)}</td>
              <td>{user.disabled ? 'לא פעיל' : 'פעיל'}</td>
              <td>
                <button onClick={() => handleChangeAccountStatus(user.uid, user.disabled ? 'inactive' : 'active')}>
                  {user.disabled ? 'הפעל חשבון' : 'השבת חשבון'}
                </button>
                <button onClick={() => handleShowChatLog(user.email)}>הצג לוג שיחה</button>
                <button onClick={() => handleShowUser(user.email)}>הצג משתמש</button>
                {user.isAdmin ? (
                  <button onClick={() => handleRemoveAdmin(user.email)}>בטל הרשאות ניהול</button>
                ) : (
                  <button onClick={() => handleSetAdmin(user.email)}>הגדר כמנהל</button>
                )}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
      {selectedEmail && (
        <UserModal email={selectedEmail} onClose={handleCloseUserModal} />
      )}
      {notification.message && (
        <Notification
          message={notification.message}
          type={notification.type}
          onClose={() => setNotification({ message: '', type: '' })}
        />
      )}
    </div>
  );
};

export default UserManagement;
