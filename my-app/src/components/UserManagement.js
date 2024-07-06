import React, { useState, useEffect } from 'react';
import { db, collection, getDocs, query, orderBy, updateDoc, deleteDoc, doc } from '../fireBase/firebase';
import '../styles/UserManagement.css';

const UserManagement = () => {
  const [users, setUsers] = useState([]);
  const [filteredUsers, setFilteredUsers] = useState([]);
  const [search, setSearch] = useState('');
  const [sortField, setSortField] = useState('registrationDate');
  const [sortOrder, setSortOrder] = useState('asc');

  useEffect(() => {
    fetchUsers();
  }, []);

  const fetchUsers = async () => {
    const usersSnapshot = await getDocs(collection(db, 'users'));
    const usersData = usersSnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
    setUsers(usersData);
    setFilteredUsers(usersData);
  };

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

  const handleDeleteUser = async (userId) => {
    await deleteDoc(doc(db, 'users', userId));
    fetchUsers();
  };

  const handleChangeAccountStatus = async (userId, newStatus) => {
    await updateDoc(doc(db, 'users', userId), { status: newStatus });
    fetchUsers();
  };

  const handleShowChatLog = (userId) => {
    // Implement the logic to show chat log for the user
  };

  const formatDate = (timestamp) => {
    if (!timestamp) return 'N/A';
    return new Date(timestamp.seconds * 1000).toLocaleDateString();
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
            <th onClick={() => handleSort('registrationDate')}>תאריך הרשמה</th>
            <th onClick={() => handleSort('lastEntryDate')}>תאריך כניסה אחרון</th>
            <th onClick={() => handleSort('status')}>סטטוס חשבון</th>
            <th>פעולות</th>
          </tr>
        </thead>
        <tbody>
          {filteredUsers.map(user => (
            <tr key={user.id}>
              <td>{user.email}</td>
              <td>{formatDate(user.registrationDate)}</td>
              <td>{formatDate(user.lastEntryDate)}</td>
              <td>{user.status}</td>
              <td>
                <button onClick={() => handleDeleteUser(user.id)}>מחק חשבון</button>
                <button onClick={() => handleChangeAccountStatus(user.id, user.status === 'active' ? 'inactive' : 'active')}>
                  {user.status === 'active' ? 'השבת חשבון' : 'הפעל חשבון'}
                </button>
                <button onClick={() => handleShowChatLog(user.id)}>הצג לוג שיחה</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default UserManagement;
