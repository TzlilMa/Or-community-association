import React, { useEffect, useState } from "react";
import { Route, Routes, Navigate } from "react-router-dom";
import Header from "./components/Header";
import Calendar from "./components/Calendar/Calendar";
import PersonalArea from "./components/PersonalArea/PeronalArea";
import LoginPage from "./pages/loginPage";
import Homepage from "./pages/homepage";
import RegistrationForm from "./pages/registrationFormPage";
import ResetPassword from "./pages/resetPwdPage";
import Documents from "./components/Documents";
import Chat from "./components/Chat";
import InquiryForm from "./components/Inquiry/InquiryForm";
import AdminInquiryList from "./components/Inquiry/AdminInquiryList";
import openChatIcon from "./assets/chat-icon.png";
import closeChatIcon from "./assets/close_chat.png";
import CardGrid from "./components/PersonalStory/CardGrid";
import Reports from "./components/Reports";
import UserManagement from "./components/UserManagement"; // Import the UserManagement component
import { auth, db } from "./fireBase/firebase";
import { getDoc, doc } from "firebase/firestore";
import "./App.css";

const App = () => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isAdmin, setIsAdmin] = useState(false);
  const [showChat, setShowChat] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged(async (user) => {
      if (user) {
        setIsAuthenticated(true);
        const userDoc = await getDoc(doc(db, "users", user.email));
        setIsAdmin(userDoc.exists() && userDoc.data().isAdmin);
      } else {
        setIsAuthenticated(false);
        setIsAdmin(false);
      }
      setLoading(false);
    });
    return () => unsubscribe();
  }, []);

  const toggleChat = () => {
    setShowChat(!showChat);
  };

  if (loading) {
    return <div>Loading...</div>; // Or a loading spinner
  }

  return (
    <div className="App">
      <Header isAdmin={isAdmin} />
      <main>
        <Routes>
          {isAuthenticated ? (
            <>
              <Route path="/" element={<Homepage />} />
              <Route path="/calendar" element={<Calendar />} />
              <Route path="/profile" element={<PersonalArea />} />
              <Route path="/chat" element={<Chat />} />
              <Route path="/documents" element={<Documents />} />
              <Route path="/stories" element={<CardGrid />} />
              {isAdmin ? (
                <>
                  <Route path="/admin-inquiries" element={<AdminInquiryList />} />
                  <Route path="/reports" element={<Reports />} />
                  <Route path="/accountspanel" element={<UserManagement />} />
                  <Route path="*" element={<Navigate to="/accountspanel" />} />
                </>
              ) : (
                <>
                  <Route path="/inquiry" element={<InquiryForm />} />
                  <Route path="*" element={<Navigate to="/" />} />
                </>
              )}
            </>
          ) : (
            <>
              <Route path="/login" element={<LoginPage />} />
              <Route path="/registrationForm" element={<RegistrationForm />} />
              <Route path="/resetPassword" element={<ResetPassword />} />
              <Route path="*" element={<Navigate to="/login" />} />
            </>
          )}
        </Routes>

        {/* {isAuthenticated && (
          <img
            src={showChat ? closeChatIcon : openChatIcon}
            alt="chat"
            className="chat-icon"
            onClick={toggleChat}
          />
        )}

        {showChat && <Chat />} */}
      </main>
    </div>
  );
};

export default App;
