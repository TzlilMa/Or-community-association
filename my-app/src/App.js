// src/App.js
import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import { AuthProvider } from './login/AuthContext';
import Login from './login/Login';
import PersonalArea from './pages/PersonalArea';
import PrivateRoute from './login/PrivateRoute'; // Match the file name exactly


function App() {
  return (
    <AuthProvider>
      <Router>
        <Routes>
          <Route path="/" element={<Login />} />
          <Route path="/personal-area" element={<PrivateRoute><PersonalArea /></PrivateRoute>} />
        </Routes>
      </Router>
    </AuthProvider>
  );
}

export default App;
