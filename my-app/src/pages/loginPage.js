// src/pages/loginPage.js
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { signInWithEmailAndPassword, onAuthStateChanged } from 'firebase/auth';
import { auth } from '../fireBase/firebase';
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
      navigate('/', { state: { email: user.email } });
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
            <p>עדיין אין לך חשבון? <button onClick={handleSignup}>להרשמה</button></p>
          </div>
        </div>
      </div>
  );
};

export default LoginPage;
