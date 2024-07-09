// src/PrivateRoute.js
import React, { useEffect, useState } from 'react';
import { Navigate } from 'react-router-dom';
import { auth, db } from './fireBase/firebase';
import { query, collection, where, getDocs } from 'firebase/firestore';
import PasswordPrompt from './components/Admin/PasswordPrompt';

const PrivateRoute = ({ children, adminOnly = false, passwordProtected = false }) => {
  const [currentUser, setCurrentUser] = useState(null);
  const [isAdmin, setIsAdmin] = useState(false);
  const [loading, setLoading] = useState(true);
  const [passwordValid, setPasswordValid] = useState(!passwordProtected);

  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged(async (user) => {
      if (user) {
        setCurrentUser(user);
        const userQuerySnapshot = await getDocs(query(collection(db, 'users'), where('email', '==', user.email)));
        if (!userQuerySnapshot.empty) {
          const userData = userQuerySnapshot.docs[0].data();
          setIsAdmin(userData.isAdmin || false);
        } else {
          setIsAdmin(false);
        }
      } else {
        setCurrentUser(null);
        setIsAdmin(false);
      }
      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  const handlePasswordValidation = (isValid) => {
    setPasswordValid(isValid);
  };

  if (loading) {
    return <div>Loading...</div>; // or some kind of loading spinner
  }

  if (!currentUser) {
    return <Navigate to="/login" />;
  }

  if (adminOnly && !isAdmin) {
    return <Navigate to="/" />;
  }

  if (passwordProtected && !passwordValid) {
    return <PasswordPrompt onValidation={handlePasswordValidation} />;
  }

  return children;
};

export default PrivateRoute;
