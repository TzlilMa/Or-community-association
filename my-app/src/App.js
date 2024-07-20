import React, { useEffect, useState } from "react";
import { Route, Routes, Navigate } from "react-router-dom";
import { Spinner } from "react-bootstrap";
import "bootstrap/dist/css/bootstrap.min.css"; // Import Bootstrap CSS
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
import AdminInquiryList from "./components/Admin/AdminInquiryList";
import CardGrid from "./components/PersonalStory/CardGrid";
import Reports from "./components/Admin/Reports";
import UserManagement from "./components/Admin/UserManagementAdmin";
import ChatLogPage from "./components/Admin/ChatLogAdminPage";
import PrivateRoute from "./PrivateRoute";
import { auth, db } from "./fireBase/firebase";
import { getDoc, doc, onSnapshot } from "firebase/firestore";
import { UserProvider } from './UserContext';
import "./App.css";

const App = () => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isAdmin, setIsAdmin] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged(async (user) => {
      if (user) {
        const userDocRef = doc(db, "users", user.email);
        const userDoc = await getDoc(userDocRef);
        if (userDoc.exists() && !userDoc.data().disabled) {
          setIsAuthenticated(true);
          setIsAdmin(userDoc.data().isAdmin);
          
          const unsubscribeUserDoc = onSnapshot(userDocRef, (docSnapshot) => {
            if (docSnapshot.exists() && docSnapshot.data().disabled) {
              setIsAuthenticated(false);
              setIsAdmin(false);
              auth.signOut();
            }
          });

          return () => unsubscribeUserDoc();
        } else {
          setIsAuthenticated(false);
          setIsAdmin(false);
          await auth.signOut(); // Ensure the user is signed out if they are disabled
        }
      } else {
        setIsAuthenticated(false);
        setIsAdmin(false);
      }
      setLoading(false);
    });
    return () => unsubscribe();
  }, []);

  if (loading) {
    return (
      <div className="spinner-container">
        <Spinner animation="border" role="status">
        </Spinner>
      </div>
    ); // Or a loading spinner
  }

  return (
    <UserProvider>
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
                    <Route
                      path="/admin-inquiries"
                      element={
                        <PrivateRoute adminOnly={true}>
                          <AdminInquiryList />
                        </PrivateRoute>
                      }
                    />
                    <Route
                      path="/reports"
                      element={
                        <PrivateRoute adminOnly={true}>
                          <Reports />
                        </PrivateRoute>
                      }
                    />
                    <Route
                      path="/accountspanel"
                      element={
                        <PrivateRoute adminOnly={true} passwordProtected={true}>
                          <UserManagement />
                        </PrivateRoute>
                      }
                    />
                    <Route
                      path="/chat-log/:email"
                      element={
                        <PrivateRoute adminOnly={true}>
                          <ChatLogPage />
                        </PrivateRoute>
                      }
                    />
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
        </main>
      </div>
    </UserProvider>
  );
};

export default App;
