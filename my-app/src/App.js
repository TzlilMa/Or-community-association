// src/App.js
import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import { AuthProvider } from './fireBase/AuthContext';
import Login from './pages/loginPage';
import PersonalArea from './pages/PersonalArea';
import RegistrationForm from './pages/registrationFormPage';
import PrivateRoute from './PrivateRoute';

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
