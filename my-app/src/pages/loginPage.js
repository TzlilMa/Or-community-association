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
      const userCredential = await signInWithEmailAndPassword(auth, email, password);
      // Access user information
      const user = userCredential.user;
      
      // Navigate to personal area with email
      navigate('/personal-area', { state: { email: user.email } });
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
