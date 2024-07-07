// server/server.js
const express = require('express');
const { getAllUsers, deleteUser, updateUserStatus } = require('./functions');

const app = express();
const PORT = process.env.PORT || 5000;

app.use(express.json()); // To parse JSON bodies

app.get('/api/users', async (req, res) => {
  try {
    const users = await getAllUsers();
    res.status(200).json(users);
  } catch (error) {
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

app.delete('/api/user/:uid', async (req, res) => {
  try {
    await deleteUser(req.params.uid);
    res.status(200).json({ message: 'User deleted successfully' });
  } catch (error) {
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

app.patch('/api/user/:uid', async (req, res) => {
  try {
    const { status } = req.body;
    await updateUserStatus(req.params.uid, status);
    res.status(200).json({ message: 'User status updated successfully' });
  } catch (error) {
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
