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
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      if (user) {
        // Ensure the email used as the document ID is lowercase
        const userEmail = user.email.toLowerCase();
        const userDocRef = doc(db, "users", userEmail);

        // Fetch the user document from Firestore
        const userDoc = await getDoc(userDocRef);

        if (userDoc.exists()) {
          const userData = userDoc.data();
          if (!userData.disabled) {
            navigate('/', { state: { email: user.email } });
          } else {
            await auth.signOut();
          }
        } else {
          setError('אירעה שגיאה בהתחברות. נסה שוב.');
          await auth.signOut();
        }
      }
    });
    return () => unsubscribe();
  }, [navigate]);

  const handleLogin = async (event) => {
    event.preventDefault();
    setError(''); // Reset the error message

    try {
      const userCredential = await signInWithEmailAndPassword(auth, email, password);
      const user = userCredential.user;

      // Ensure the email used as the document ID is lowercase
      const userEmail = email.toLowerCase();
      const userDocRef = doc(db, "users", userEmail);

      // Fetch the user document from Firestore
      const userDoc = await getDoc(userDocRef);

      if (userDoc.exists()) {
        const userData = userDoc.data();

        if (!userData.disabled) {
          // Update lastSignInTime
          await updateDoc(userDocRef, {
            lastSignInTime: new Date().toISOString()
          });
          navigate('/', { state: { email: user.email } });
        } else {
          setError('חשבונך נחסם. פנה למנהל המערכת.');
          await auth.signOut(); // Sign out the user
        }
      } else {
        setError('User data not found.');
        await auth.signOut(); // Sign out the user
      }
    } catch (error) {
      console.error('Login error:', error);
      setError('שם משתמש או סיסמא שגויים');
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
