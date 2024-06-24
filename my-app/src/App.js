// src/App.js
import React, { useEffect, useState } from 'react';
import { Route, Routes, Navigate } from 'react-router-dom';
import Header from './components/Header';
import Calendar from './components/Calendar/Calendar';
import PersonalArea from './components/PersonalArea/PeronalArea';
import LoginPage from './pages/loginPage';
import Homepage from './pages/homepage';
import RegistrationForm from './pages/registrationFormPage';
import ResetPassword from './pages/resetPwdPage';
import Documents from './components/Documents';
import Chat from './components/Chat';
import InquiryForm from './components/Inquiry/InquiryForm'; // Corrected path
import AdminInquiryList from './components/Inquiry/AdminInquiryList'; // Corrected path
import chatIcon from './assets/chat-icon.png';
import CardGrid from './components/CardGrid'; // Ensure this import is correct
import { auth, db } from './fireBase/firebase'; // Ensure db is imported
import { getDoc, doc } from 'firebase/firestore'; // Ensure getDoc and doc are imported
import './App.css'; // Global CSS if any

const App = () => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isAdmin, setIsAdmin] = useState(false); // Add state to check if user is admin
  const [showChat, setShowChat] = useState(false);

  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged(async (user) => {
      if (user) {
        setIsAuthenticated(true);
        const userDoc = await getDoc(doc(db, 'users', user.email));
        setIsAdmin(userDoc.exists() && userDoc.data().isAdmin);
      } else {
        setIsAuthenticated(false);
        setIsAdmin(false);
      }
    });
    return () => unsubscribe();
  }, []);

  const toggleChat = () => {
    setShowChat(!showChat);
  };

  return (
    <div className="App">
      <Header isAdmin={isAdmin} />
      <div className="content">
        {isAuthenticated ? (
          <>
            <Routes>
              <Route path="/" element={<Homepage />} />
              <Route path="/calendar" element={<Calendar />} />
              <Route path="/profile" element={<PersonalArea />} />
              <Route path="/chat" element={<Chat />} />
              <Route path="/documents" element={<Documents />} />
              <Route path="/stories" element={<CardGrid />} /> 
              {isAdmin ?
               <Route path="/admin-inquiries" element={<AdminInquiryList />} />
                :
                <Route path="/inquiry" element={<InquiryForm />} />
              }
              
              <Route path="*" element={<Navigate to="/" />} />
            </Routes>
          </>
        ) : (
          <Routes>
            <Route path="/login" element={<LoginPage />} />
            <Route path="/registrationForm" element={<RegistrationForm />} />
            <Route path="/resetPassword" element={<ResetPassword />} />
            <Route path="*" element={<Navigate to="/login" />} />
          </Routes>
        )}
      </div>
      <footer className="footer">
        {isAuthenticated && (
          <img
            src={chatIcon}
            alt="chat"
            className="chat-icon"
            onClick={toggleChat}
          />
        )}
        קהילת אור, לאנשים עם פגיעה מוחית
      </footer>
      {showChat && <Chat />}
    </div>
  );
};

export default App;
