// src/App.js
import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import { AuthProvider } from './login/AuthContext';
import Login from './login/loginPage';
import PersonalArea from './pages/PersonalArea';
import RegistrationForm from './registrationForm';
import PrivateRoute from './login/PrivateRoute'; // Match the file name exactly

function App() {
  return (
    <AuthProvider>
      <Router>
        <Routes>
          <Route path="/" element={<Login />} />
          <Route path="/personal-area" element={<PrivateRoute><PersonalArea /></PrivateRoute>} />
          <Route path="/registrationForm" element={<RegistrationForm />} />
        </Routes>
      </Router>
    </AuthProvider>
  );
}

export default App;
