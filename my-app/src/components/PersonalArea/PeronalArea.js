import React, { useState, useEffect, useRef } from "react";
import { db, doc, getDoc, setDoc, auth } from "../../fireBase/firebase";
import {
  reauthenticateWithCredential,
  EmailAuthProvider,
  updatePassword,
} from "firebase/auth";
import Notification from "../General/Notification";
import ReactQuill from "react-quill";
import "react-quill/dist/quill.snow.css";
import "../../styles/PersonalArea.css";
import { useUser } from '../../UserContext'; // Import useUser

const PersonalArea = () => {
  const { user, updateUser } = useUser(); // Use the UserContext
  const [userDetails, setUserDetails] = useState({
    firstName: user.firstName,
    lastName: "",
    gender: "male",
  });
  const [userStory, setUserStory] = useState({
    personalStory: "",
    isStoryPublic: false,
  });
  const [loading, setLoading] = useState(true);
  const [storyLength, setStoryLength] = useState(0);
  const [passwordData, setPasswordData] = useState({
    currentPassword: "",
    newPassword: "",
    confirmPassword: "",
  });

  const [passwordError, setPasswordError] = useState("");
  const [isPasswordTooShort, setIsPasswordTooShort] = useState(false);
  const [notification, setNotification] = useState({ message: "", type: "" });

  const MIN_PASSWORD_LENGTH = 6;
  const MIN_STORY_LENGTH = 100;
  const MAX_CHARS = 5000;

  const changePasswordRef = useRef(null); // Ref for the "Change Password" section

  const modules = {
    toolbar: [
      ['bold', 'italic', 'underline', 'link']
    ],
  };

  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged((user) => {
      if (user) {
        const fetchUserData = async () => {
          try {
            const userDoc = await getDoc(doc(db, "users", user.email));
            if (userDoc.exists()) {
              const userDataFromDB = userDoc.data();
              setUserDetails({
                firstName: userDataFromDB.firstName,
                lastName: userDataFromDB.lastName,
                gender: userDataFromDB.gender,
              });
              setUserStory({
                personalStory: userDataFromDB.personalStory,
                isStoryPublic: userDataFromDB.isStoryPublic,
              });
              setStoryLength(
                stripHtmlTags(userDataFromDB.personalStory || "").length
              );
            } else {
              console.error("User document does not exist.");
            }
          } catch (error) {
            console.error("Error fetching user data:", error);
          } finally {
            setLoading(false);
          }
        };
        fetchUserData();
      } else {
        console.log("No user is signed in.");
        setLoading(false);
      }
    });

    return () => unsubscribe();
  }, []);

  const handleDetailsChange = (event) => {
    const { name, value } = event.target;
    setUserDetails((prevDetails) => ({
      ...prevDetails,
      [name]: value,
    }));
  };

  const stripHtmlTags = (html) => {
    const div = document.createElement("div");
    div.innerHTML = html;
    return div.textContent || div.innerText || "";
  };

  const handleStoryChange = (value) => {
    const strippedValue = stripHtmlTags(value);
    if (strippedValue.length > MAX_CHARS) {
      setNotification({
        message: `הסיפור חייב להיות באורך של עד ${MAX_CHARS} תווים`,
        type: "error",
      });
      return;
    }
    setStoryLength(strippedValue.length);
    setUserStory((prevStory) => ({
      ...prevStory,
      personalStory: value,
    }));
  };

  const handleCheckboxChange = (event) => {
    const isPublic = event.target.checked;
    if (
      isPublic &&
      stripHtmlTags(userStory.personalStory).length < MIN_STORY_LENGTH
    ) {
      setNotification({
        message: `הסיפור חייב להיות באורך של לפחות ${MIN_STORY_LENGTH} תווים כדי להיות ציבורי`,
        type: "error",
      });
      return;
    }
    setUserStory((prevStory) => ({
      ...prevStory,
      isStoryPublic: isPublic,
    }));
  };

  const handlePasswordChangeInput = (event) => {
    const { name, value } = event.target;
    setPasswordData((prevData) => ({
      ...prevData,
      [name]: value,
    }));

    if (name === "newPassword") {
      setIsPasswordTooShort(value.length < MIN_PASSWORD_LENGTH);
    }
  };

  const handleDetailsSubmit = async (event) => {
    event.preventDefault();

    if (!userDetails.firstName.trim() || !userDetails.lastName.trim()) {
      setNotification({
        message: "שם פרטי ושם משפחה הינם שדות חובה",
        type: "error",
      });
      return;
    }

    const allowedFields = ["firstName", "lastName", "gender"];
    const updateData = {};

    allowedFields.forEach((field) => {
      if (userDetails[field] !== undefined) {
        updateData[field] = userDetails[field];
      }
    });

    console.log("Update data:", updateData);

    try {
      await setDoc(doc(db, "users", auth.currentUser.email), updateData, {
        merge: true,
      });
      updateUser({ ...user, firstName: userDetails.firstName }); // Update the user context
      setNotification({ message: "הנתונים נשמרו בהצלחה", type: "success" });
    } catch (error) {
      console.error("Error updating user details:", error);
      setNotification({
        message: "אירעה שגיאה בעדכון נתונים, אנא נסה שוב מאוחר יותר",
        type: "error",
      });
    }
  };

  const handleStorySubmit = async () => {
    if (
      userStory.isStoryPublic &&
      stripHtmlTags(userStory.personalStory).length < MIN_STORY_LENGTH
    ) {
      setNotification({
        message: `הסיפור חייב להיות באורך של לפחות ${MIN_STORY_LENGTH} תווים כדי להיות ציבורי`,
        type: "error",
      });
      return;
    }

    try {
      await setDoc(doc(db, "users", auth.currentUser.email), userStory, {
        merge: true,
      });
      setNotification({ message: "הסיפור נשמר בהצלחה", type: "success" });
    } catch (error) {
      console.error("Error updating personal story:", error);
      setNotification({
        message: "אירעה שגיאה בעדכון הסיפור, אנא נסה שוב מאוחר יותר",
        type: "error",
      });
    }
  };

  const handleChangePassword = async () => {
    if (passwordData.newPassword !== passwordData.confirmPassword) {
      setPasswordError("הסיסמאות אינן תואמות");
      return;
    }

    if (passwordData.newPassword.length < MIN_PASSWORD_LENGTH) {
      setPasswordError(
        `הסיסמה חייבת להיות באורך של לפחות ${MIN_PASSWORD_LENGTH} תווים`
      );
      return;
    }

    try {
      const user = auth.currentUser;
      const credential = EmailAuthProvider.credential(
        user.email,
        passwordData.currentPassword
      );

      await reauthenticateWithCredential(user, credential);

      await updatePassword(user, passwordData.newPassword);

      setPasswordError("");
      setNotification({ message: "סיסמא שונתה בהצלחה", type: "success" });
      setPasswordData({
        currentPassword: "",
        newPassword: "",
        confirmPassword: "",
      });
    } catch (error) {
      console.error("Error changing password:", error);
      setPasswordError("אירעה שגיאה, בדוק את הסיסמה הנוכחית ונסה שוב");
    }
  };

  const scrollToChangePassword = () => {
    changePasswordRef.current.scrollIntoView({ behavior: "smooth" });
  };

  if (loading) {
    return (
      <div className="spinner-container">
        <div className="spinner"></div>
      </div>
    );
  }

  return (
    <div className="personal-area-container">
      <div className="personal-area">
        <h1>
          {userDetails.firstName}, איזה כיף{" "}
          {userDetails.gender === "male" ? "שאתה פה" : "שאת פה"}!
        </h1>
        <h3>הינה הפרטים שלך כפי שהם מעודכנים במערכת</h3>
        <form onSubmit={handleDetailsSubmit} className="personal-area-form">
          <label className="form-label">
            שם פרטי:
            <input
              type="text"
              name="firstName"
              value={userDetails.firstName}
              onChange={handleDetailsChange}
              className="input"
            />
          </label>
          <label className="form-label">
            שם משפחה:
            <input
              type="text"
              name="lastName"
              value={userDetails.lastName}
              onChange={handleDetailsChange}
              className="input"
            />
          </label>
          <label className="form-label">
            תפנו אליי בלשון:
            <select
              name="gender"
              value={userDetails.gender}
              onChange={handleDetailsChange}
              className="input"
            >
              <option value="male">זכר</option>
              <option value="female">נקבה</option>
            </select>
          </label>
          <label className="form-label">
            כתובת מייל:
            <input
              type="email"
              name="email"
              value={auth.currentUser.email}
              readOnly
              className="input read-only"
            />
          </label>
          <div className="btns-personal-area">
            <button type="submit" className="submit-btn">
              שמור
            </button>
            <button
              type="button"
              className="scroll-change-pwd-btn"
              onClick={scrollToChangePassword}
            >
              שנה סיסמא
            </button>
          </div>
        </form>
      </div>
      <div className="personal-story-section quill-container">
        <h2>הסיפור שלי</h2>
        <p>
          קהילת אור מאפשרת לחברי הקהילה לשתף את הסיפור האישי שלהם. כאן זה המקום
          לעשות זאת!
        </p>
        <ReactQuill
          value={userStory.personalStory}
          onChange={handleStoryChange}
          modules={modules}
        />
        <div className="story-footer">
          <p>
            {storyLength}/{MAX_CHARS}
          </p>
          <label className="checkbox-label">
            <input
              type="checkbox"
              name="isStoryPublic"
              checked={userStory.isStoryPublic}
              onChange={handleCheckboxChange}
              className="checkbox-input"
            />
            אני מאשר/ת שהסיפור שלי ישותף עם חברי הקהילה
          </label>
        </div>
        <div className="btns-personal-area">
          <button
            type="button"
            className="submit-btn"
            onClick={handleStorySubmit}
          >
            שמור
          </button>
        </div>
      </div>
      <div className="change-password-section" ref={changePasswordRef}>
        <h2>שינוי סיסמה</h2>
        <label className="form-label">
          סיסמה נוכחית:
          <input
            type="password"
            name="currentPassword"
            value={passwordData.currentPassword}
            onChange={handlePasswordChangeInput}
            className="input"
          />
        </label>
        <label className="form-label">
          סיסמה חדשה:
          <input
            type="password"
            name="newPassword"
            value={passwordData.newPassword}
            onChange={handlePasswordChangeInput}
            className="input"
          />
        </label>
        {isPasswordTooShort && (
          <p className="password-length-warning">קצר מידי</p>
        )}
        <label className="form-label">
          אשר סיסמה חדשה:
          <input
            type="password"
            name="confirmPassword"
            value={passwordData.confirmPassword}
            onChange={handlePasswordChangeInput}
            className="input"
          />
        </label>
        {passwordError && <p className="error">{passwordError}</p>}
        <button
          type="button"
          className="change-password-btn"
          onClick={handleChangePassword}
        >
          שנה סיסמה
        </button>
      </div>
      {notification.message && (
        <Notification
          message={notification.message}
          type={notification.type}
          onClose={() => setNotification({ message: "", type: "" })}
        />
      )}
    </div>
  );
};

export default PersonalArea;
