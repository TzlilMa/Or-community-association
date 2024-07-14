import React, { useState, useEffect, useCallback } from 'react';
import { getFirestore, getDocs, collection, updateDoc, doc, query, where } from 'firebase/firestore';
import UserModal from './UserModalAdmin';
import '../../styles/UserManagement.css';
import Notification from '../General/Notification';

const UserManagement = () => {
  const db = getFirestore();
  const [users, setUsers] = useState([]);
  const [filteredUsers, setFilteredUsers] = useState([]);
  const [search, setSearch] = useState('');
  const [sortField, setSortField] = useState('creationTime');
  const [sortOrder, setSortOrder] = useState('desc'); // Default to descending for newest users first
  const [selectedEmail, setSelectedEmail] = useState(null);
  const [notification, setNotification] = useState({ message: '', type: '' });

  const fetchUsers = useCallback(async () => {
    try {
      const usersSnapshot = await getDocs(collection(db, 'users'));
      const usersList = usersSnapshot.docs.map(doc => {
        const data = doc.data();
        return {
          email: doc.id,
          ...data,
          creationTime: data.creationTime && data.creationTime.toDate ? data.creationTime.toDate() : (data.creationTime || 'N/A'),
          lastSignInTime: data.lastSignInTime && data.lastSignInTime.toDate ? data.lastSignInTime.toDate() : (data.lastSignInTime || 'N/A'),
        };
      });

      const sortedUsersList = usersList.sort((a, b) => {
        if (a.creationTime === 'N/A') return 1;
        if (b.creationTime === 'N/A') return -1;
        if (a.creationTime < b.creationTime) return 1;
        if (a.creationTime > b.creationTime) return -1;
        return 0;
      });

      setUsers(sortedUsersList);
      setFilteredUsers(sortedUsersList);
    } catch (error) {
      console.error('Error fetching users:', error);
    }
  }, [db]);

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
    let order = 'asc';
    if (sortField === field) {
      order = sortOrder === 'asc' ? 'desc' : 'asc';
    }
    setSortField(field);
    setSortOrder(order);

    const sorted = [...filteredUsers].sort((a, b) => {
      if (field === 'disabled') {
        // Sort by account status
        if (a.disabled === b.disabled) return 0;
        return a.disabled === false ? (order === 'asc' ? -1 : 1) : (order === 'asc' ? 1 : -1);
      }
      if (a[field] === 'N/A') return 1;
      if (b[field] === 'N/A') return -1;
      if (a[field] < b[field]) return order === 'asc' ? -1 : 1;
      if (a[field] > b[field]) return order === 'asc' ? 1 : -1;
      return 0;
    });

    setFilteredUsers(sorted);
  };

  const handleChangeAccountStatus = async (email, currentStatus) => {
    try {
      const newStatus = currentStatus === 'active' ? 'inactive' : 'active';
      const userRef = doc(db, 'users', email);
      await updateDoc(userRef, { disabled: newStatus === 'inactive' });
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

  const formatDate = (date) => {
    if (!date || date === 'N/A') return 'N/A';
    const d = new Date(date);
    return d.toLocaleDateString('he-IL');
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
            <th onClick={() => handleSort('firstName')}>שם פרטי</th>
            <th onClick={() => handleSort('lastName')}>שם משפחה</th>
            <th onClick={() => handleSort('creationTime')}>תאריך הרשמה</th>
            <th onClick={() => handleSort('lastSignInTime')}>תאריך כניסה אחרון</th>
            <th onClick={() => handleSort('disabled')}>סטטוס חשבון</th>
            <th>פעולות</th>
          </tr>
        </thead>
        <tbody>
          {filteredUsers.map(user => (
            <tr key={user.email}>
              <td>{user.email}</td>
              <td>{user.firstName}</td>
              <td>{user.lastName}</td>
              <td>{formatDate(user.creationTime)}</td>
              <td>{formatDate(user.lastSignInTime)}</td>
              <td>{user.disabled ? 'מושבת' : 'פעיל'}</td>
              <td>
                <button onClick={() => handleChangeAccountStatus(user.email, user.disabled ? 'inactive' : 'active')}>
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
