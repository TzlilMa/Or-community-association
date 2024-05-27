// src/App.js
import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import { AuthProvider } from './fireBase/AuthContext';
import Login from './pages/loginPage';
import Homepage from './pages/homepage';
import RegistrationForm from './pages/registrationFormPage';
import ResetPassword from './pages/resetPwdPage';
import PrivateRoute from './PrivateRoute';

function App() {
  return (
    <AuthProvider>
      <Router>
        <Routes>
          <Route path="/login" element={<Login />} />
          <Route path="/homepage" element={<PrivateRoute><Homepage /></PrivateRoute>} />
          <Route path="/registrationForm" element={<RegistrationForm />} />
          <Route path="/resetPassword" element={<ResetPassword />} />
        </Routes>
      </Router>
    </AuthProvider>
  );
}

export default App;
