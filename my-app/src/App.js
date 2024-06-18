// src/App.js
import React, { useEffect, useState } from 'react';
import { Route, Routes, Navigate } from 'react-router-dom';
import Header from './components/Header';
import Calendar from './components/Calendar/Calendar';
import PersonalArea from './components/PeronalArea';
import LoginPage from './pages/loginPage';
import Homepage from './pages/homepage';
import RegistrationForm from './pages/registrationFormPage';
import ResetPassword from './pages/resetPwdPage';
import Documents from './components/Documents';
import { auth } from './fireBase/firebase';
import './App.css'; // Global CSS if any
import PrivateRoute from './PrivateRoute'; // Add this import

const App = () => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [username, setUserName]  = useState(null)

  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged((user) => {
      if (user) {
        setIsAuthenticated(true);
        console.log(user);
        setUserName(user.displayName);
      } else {
        setIsAuthenticated(false);
      }
    });
    return () => unsubscribe();
  }, []);

  return (
    <div className="App">
      <Header userName={username}/>
      <div className="content">
        {isAuthenticated ? (
          <Routes>
            <Route path="/" element={<Homepage />} />
            <Route path="/calendar" element={<Calendar />} />
            <Route path="/personal-area" element={<PersonalArea username="exampleUsername" />} />
            <Route 
              path="/documents" 
              element={
                <PrivateRoute adminOnly={true}>
                  <Documents />
                </PrivateRoute>
              } 
            />
            {/* Add other routes as needed */}
            <Route path="*" element={<Navigate to="/" />} />
          </Routes>
        ) : (
          <Routes>
            <Route path="/login" element={<LoginPage />} />
            <Route path="/registrationForm" element={<RegistrationForm />} />
            <Route path="/resetPassword" element={<ResetPassword />} />
            <Route path="*" element={<Navigate to="/login" />} />
          </Routes>
        )}
      </div>
      <div className="footer-container">
        <div className="above-footer">This is the above footer text</div>
        <div className="main-footer">This is the main footer text</div>
        </div>
    </div>
  );
};

export default App;
