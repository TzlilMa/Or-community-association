import React, { useState } from "react";
import { sendPasswordResetEmail } from "firebase/auth";
import { auth } from "../fireBase/firebase";
import { useNavigate } from "react-router-dom";
import "../styles/resetPwdPage.css"; // Import the CSS file

const ResetPassword = () => {
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState(null);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMessage(null);
    setError(null);

    try {
      await sendPasswordResetEmail(auth, email);
      setMessage(
        "מייל עם קישור לאיפוס סיסמא נשלח אלייך. הינך מועבר לעמוד ההתחברות"
      );
      setTimeout(() => {
        navigate("/login");
      }, 5000);
    } catch (error) {
      setError(error.message);
    }
  };

  return (
    <div className="reset-page">
      <div className="gradient-background"></div>
      <div className="reset-container">
        <div className="box-shadow">
          <h1>שכחת את הסיסמא?</h1>
          <h4>
            לא קרה כלום! אנחנו נשלח אלייך קישור לאיפוס סיסמא ובעוד כמה רגעים
            תוכל להתחבר
          </h4>
          {message && <p className="message">{message}</p>}
          {error && <p className="error">{error}</p>}
          <form onSubmit={handleSubmit}>
            <div>
              <label htmlFor="email">כתובת מייל:</label>
              <input
                type="email"
                id="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
            </div>
              <button type="submit">אפס סיסמא</button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default ResetPassword;
