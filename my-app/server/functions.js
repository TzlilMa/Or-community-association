// server/functions.js
const auth = require('./admin');

async function getUserDetails(uid) {
  try {
    const userRecord = await auth.getUser(uid);
    return {
      uid: userRecord.uid,
      email: userRecord.email,
      creationTime: userRecord.metadata.creationTime,
      lastSignInTime: userRecord.metadata.lastSignInTime,
      disabled: userRecord.disabled,
    };
  } catch (error) {
    console.error('Error fetching user data:', error);
    throw error;
  }
}

async function getAllUsers() {
  const listUsersResult = await auth.listUsers();
  return listUsersResult.users.map(userRecord => ({
    uid: userRecord.uid,
    email: userRecord.email,
    creationTime: userRecord.metadata.creationTime,
    lastSignInTime: userRecord.metadata.lastSignInTime,
    disabled: userRecord.disabled,
  }));
}

async function deleteUser(uid) {
  try {
    await auth.deleteUser(uid);
  } catch (error) {
    console.error('Error deleting user:', error);
    throw error;
  }
}

async function updateUserStatus(uid, status) {
  try {
    await auth.updateUser(uid, { disabled: status === 'inactive' });
  } catch (error) {
    console.error('Error updating user status:', error);
    throw error;
  }
}

module.exports = { getUserDetails, getAllUsers, deleteUser, updateUserStatus };
