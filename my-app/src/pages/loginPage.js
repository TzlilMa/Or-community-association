import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { signInWithEmailAndPassword, onAuthStateChanged } from 'firebase/auth';
import { auth, db } from '../fireBase/firebase'; // Import Firestore
import { doc, getDoc, updateDoc } from 'firebase/firestore';
import '../styles/loginPage.css';

const LoginPage = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      if (user) {
        navigate('/', { state: { email: user.email } });
      }
    });
    return () => unsubscribe();
  }, [navigate]);

  const handleLogin = async (event) => {
    event.preventDefault();
    try {
      const userCredential = await signInWithEmailAndPassword(auth, email, password);
      const user = userCredential.user;
      
      // Check if user is active
      const userDoc = await getDoc(doc(db, "users", email));
      if (userDoc.exists()) {
        const userData = userDoc.data();
        if (!userData.disabled) {
          // Update lastSignInTime
          await updateDoc(doc(db, "users", email), {
            lastSignInTime: new Date().toISOString()
          });
          navigate('/', { state: { email: user.email } });
        } else {
          setError('Your account is disabled. Please contact support.');
        }
      } else {
        setError('User data not found.');
      }
    } catch (error) {
      setError('Invalid email or password.');
    }
  };

  const handleSignup = () => {
    navigate('/registrationForm');
  };

  const handleForgetPwd = () => {
    navigate('/resetPassword');
  };

  return (
    <div className="login-background">
        <div className="login-container">
          <h2>התחברות</h2>
          <form className="login-form" onSubmit={handleLogin}>
            <label>כתובת מייל:</label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
            <label>סיסמא:</label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
            {error && <p className="error-message">{error}</p>}
            <button type="submit">כניסה</button>
          </form>
          <div className="additional-options">
            <button onClick={handleForgetPwd}>שכחת את הסיסמא?</button>
            <p>עדיין אין לך חשבון? <button onClick={handleSignup}>הרשם כאן</button></p>
          </div>
        </div>
      </div>
  );
};

export default LoginPage;
