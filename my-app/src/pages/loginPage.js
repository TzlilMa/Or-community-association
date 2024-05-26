import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { signInWithEmailAndPassword } from 'firebase/auth';
import { auth } from '../fireBase/firebase';
import '../styles/loginPage.css';

const LoginPage = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleLogin = async (event) => {
    event.preventDefault();
    try {
      console.log('Attempting to sign in...');
      const userCredential = await signInWithEmailAndPassword(auth, email, password);
      console.log('Sign-in successful:', userCredential);

      // Access user information
      const user = userCredential.user;
      console.log('User ID:', user.uid);
      console.log('User Email:', user.email);
      console.log('Display Name:', user.first);  // Display name of the user
      console.log('Is Email Verified:', user.emailVerified);
      
      // Navigate to personal area with email
      navigate('/personal-area', { state: { email: user.email } });
    } catch (error) {
      setError('Invalid email or password.');
    }
  };

  const handleSignup = () => {
    navigate('/registrationForm');
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
      <p>Don't have an account? <button onClick={handleSignup}>Sign Up</button></p>
    </div>
  );
};

export default LoginPage;
