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

  // Check if the user is already authenticated
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      if (user) {
        // If user is authenticated, navigate to the homepage
        navigate('/homepage', { state: { email: user.email } });
      }
    });

    // Clean up the subscription
    return () => unsubscribe();
  }, [navigate]);

  const handleLogin = async (event) => {
    event.preventDefault();
    try {
      const userCredential = await signInWithEmailAndPassword(auth, email, password);
      // Access user information
      const user = userCredential.user;
      
      // Navigate to personal area with email
      navigate('/homepage', { state: { email: user.email } });
    } catch (error) {
      setError('Invalid email or password.');
    }
  };

  const handleSignup = () => {
    navigate('/registrationForm');
  };

  const handleForgetPwd = () => {
    navigate('/resetPassword')
  };

  return (
    <div className="login-container">
      <h2>Login</h2>
      <form className="login-form" onSubmit={handleLogin}>
        <div>
          <label>Email:</label>
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
        </div>
        <div>
          <label>Password:</label>
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
        </div>
        {error && <p className="error-message">{error}</p>}
        <button type="submit">Login</button>
      </form>
      <button onClick={handleForgetPwd}>?שכחת את הסיסמא</button>
      <p>Don't have an account? <button onClick={handleSignup}>Sign Up</button></p>
    </div>
  );
};

export default LoginPage;
