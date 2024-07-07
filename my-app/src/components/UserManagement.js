import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import UserModal from './UserModal';
import '../styles/UserManagement.css';

const UserManagement = () => {
  const [users, setUsers] = useState([]);
  const [filteredUsers, setFilteredUsers] = useState([]);
  const [search, setSearch] = useState('');
  const [sortField, setSortField] = useState('creationTime');
  const [sortOrder, setSortOrder] = useState('asc');
  const [selectedEmail, setSelectedEmail] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    fetchUsers();
  }, []);

  const fetchUsers = async () => {
    try {
      const response = await axios.get('/api/users');
      setUsers(response.data);
      setFilteredUsers(response.data);
    } catch (error) {
      console.error('Error fetching users:', error);
    }
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
    try {
      await axios.delete(`/api/user/${userId}`);
      fetchUsers(); // Refresh the list of users
    } catch (error) {
      console.error('Error deleting user:', error);
    }
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
    console.log("Selected user email:", email); // Debug log
    setSelectedEmail(email);
  };

  const handleCloseUserModal = () => {
    setSelectedEmail(null);
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
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {filteredUsers.map(user => (
            <tr key={user.uid}>
              <td>{user.email}</td>
              <td>{formatDate(user.creationTime)}</td>
              <td>{formatDate(user.lastSignInTime)}</td>
              <td>{user.disabled ? 'Inactive' : 'Active'}</td>
              <td>
                <button onClick={() => handleDeleteUser(user.uid)}>מחק חשבון</button>
                <button onClick={() => handleChangeAccountStatus(user.uid, user.disabled ? 'inactive' : 'active')}>
                  {user.disabled ? 'הפעל חשבון' : 'השבת חשבון'}
                </button>
                <button onClick={() => handleShowChatLog(user.email)}>הצג לוג שיחה</button>
                <button onClick={() => handleShowUser(user.email)}>הצג משתמש</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
      {selectedEmail && (
        <UserModal email={selectedEmail} onClose={handleCloseUserModal} />
      )}
    </div>
  );
};

export default UserManagement;
