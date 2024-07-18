import React, { useState, useEffect } from "react";
import { createUserWithEmailAndPassword } from "firebase/auth";
import { auth, setDoc, doc, db } from "../fireBase/firebase";
import "../styles/registrationForm.css";

const RegistrationForm = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [dateOfBirth, setDateOfBirth] = useState("");
  const [age, setAge] = useState(null);
  const [personalStory, setPersonalStory] = useState("");
  const [isStoryPublic, setIsStoryPublic] = useState(false);
  const [gender, setGender] = useState("");
  const [isAdmin, setIsAdmin] = useState(false);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false); // Loading state

  useEffect(() => {
    if (dateOfBirth) {
      const birthDate = new Date(dateOfBirth);
      const today = new Date();
      const ageInMilliseconds = today - birthDate;
      const calculatedAge = Math.floor(
        ageInMilliseconds / (1000 * 60 * 60 * 24 * 365.25)
      );
      setAge(calculatedAge);
    } else {
      setAge(null);
    }
  }, [dateOfBirth]);

  const handleRegistration = async (e) => {
    e.preventDefault();
    setLoading(true); // Start loading

    try {
      const currentDate = new Date();
      const birthDate = new Date(dateOfBirth);
      const hebrewRegex = /^[\u0590-\u05FF\s]+$/;

      if (birthDate >= currentDate) {
        setError("אופס... תאריך הלידה לא תקין");
        setLoading(false); // Stop loading
        return;
      }

      if (password.length < 6) {
        setError("הסיסמא חייבת להכיל לפחות 6 תווים");
        setLoading(false); // Stop loading
        return;
      }

      if (!firstName.trim() || !hebrewRegex.test(firstName)) {
        setError("שם פרטי הוא שדה חובה ויכול להכיל רק תווים בעברית");
        setLoading(false); // Stop loading
        return;
      }

      if (!lastName.trim() || !hebrewRegex.test(lastName)) {
        setError("שם משפחה הוא שדה חובה ויכול להכיל רק תווים בעברית");
        setLoading(false); // Stop loading
        return;
      }

      // Register user with email and password
      const userCredential = await createUserWithEmailAndPassword(auth, email, password);
      const user = userCredential.user;

      // Add user details to Firestore
      const userData = {
        email,
        firstName: firstName.trim(),
        lastName: lastName.trim(),
        dateOfBirth,
        age,
        personalStory,
        isStoryPublic,
        gender,
        isAdmin,
        creationTime: user.metadata.creationTime,
        lastSignInTime: user.metadata.lastSignInTime,
        disabled: false, // Default value
      };
      await setDoc(doc(db, "users", email), userData);

      // Clear form fields and state
      setEmail("");
      setPassword("");
      setFirstName("");
      setLastName("");
      setDateOfBirth("");
      setAge(null);
      setPersonalStory("");
      setIsStoryPublic(false);
      setGender("");
      setIsAdmin(false);
      setError(null);
      setLoading(false); // Stop loading
    } catch (error) {
      setError("אופס... משהו השתבש, אנא נסה שוב");
      setLoading(false); // Stop loading
    }
  };

  return (
    <div className="registration-page">
      <div className="gradient-background"></div>
      <div className="registration-container">
        <h2>טופס הרשמה לקהילת אור</h2>
        {error && <p className="error-message">{error}</p>}
        <form className="registration-form" onSubmit={handleRegistration}>
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
          <label>שם פרטי:</label>
          <input
            type="text"
            value={firstName}
            onChange={(e) => setFirstName(e.target.value)}
            required
          />
          <label>שם משפחה:</label>
          <input
            type="text"
            value={lastName}
            onChange={(e) => setLastName(e.target.value)}
            required
          />
          <label>תאריך לידה:</label>
          <input
            type="date"
            value={dateOfBirth}
            onChange={(e) => setDateOfBirth(e.target.value)}
            required
          />
          <label>מגדר:</label>
          <select value={gender} onChange={(e) => setGender(e.target.value)}>
            <option value="">בחר</option>
            <option value="male">זכר</option>
            <option value="female">נקבה</option>
          </select>
          <button type="submit" disabled={loading}>
            {loading ? (
              <div className="registred-spinner"></div>
            ) : (
              "להרשמה"
            )}
          </button>
        </form>
      </div>
    </div>
  );
};

export default RegistrationForm;
