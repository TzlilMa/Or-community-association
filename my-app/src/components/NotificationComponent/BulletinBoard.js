import React, { useState, useEffect } from "react";
import {
  db,
  auth,
  getDoc,
  collection,
  query,
  getDocs,
  addDoc,
  deleteDoc,
  doc,
  orderBy,
} from "../../fireBase/firebase";
import "../../styles/BulletinBoard.css";

const BulletinBoard = () => {
  const [isAdmin, setIsAdmin] = useState(false);
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState("");
  const [showModal, setShowModal] = useState(false);
  const [action, setAction] = useState("add");
  const [selectedMessage, setSelectedMessage] = useState(null);
  const [errorMessage, setErrorMessage] = useState("");

  useEffect(() => {
    fetchNotifications();
    fetchUser();
  }, []);

  const fetchNotifications = async () => {
    try {
      const q = query(
        collection(db, "bulletinBoard"),
        orderBy("timestamp", "desc")
      );
      const querySnapshot = await getDocs(q);
      setMessages(
        querySnapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }))
      );
    } catch (error) {
      console.error("Error fetching notifications:", error);
    }
  };

  const fetchUser = async () => {
    const user = auth.currentUser;
    if (user) {
      const userDoc = await getDoc(doc(db, "users", user.email));
      if (userDoc.exists()) {
        const userData = userDoc.data();
        setIsAdmin(userData.isAdmin);
      }
    }
  };

  const handleAddMessage = async () => {
    if (!newMessage.trim()) {
      setErrorMessage("אנא מלא את תוכן ההודעה");
      return;
    }

    try {
      await addDoc(collection(db, "bulletinBoard"), {
        text: newMessage,
        timestamp: new Date(),
      });
      setNewMessage("");
      fetchNotifications();
      setShowModal(false);
    } catch (error) {
      console.error("Error adding message:", error);
    }
  };

  const handleRemoveMessage = async () => {
    if (!selectedMessage) {
      setErrorMessage("אנא בחר הודעה מהרשימה");
      return;
    }

    try {
      await deleteDoc(doc(db, "bulletinBoard", selectedMessage.id));
      setSelectedMessage(null);
      fetchNotifications();
      setShowModal(false);
    } catch (error) {
      console.error("Error removing message:", error);
    }
  };

  return (
    <div className="bulletinboard-container">
      <div className="bulletinboard-list">
        <h2>לוח הודעות</h2>
        {isAdmin && (
          <button
            className="bulletinboard-management-button"
            onClick={() => setShowModal(true)}
          >
            ניהול הודעות
          </button>
        )}
        <ul className="ads">
          {messages.map((message) => (
            <li key={message.id}>{message.text}</li>
          ))}
        </ul>
      </div>

      {showModal && (
        <div className="bulletinboard-modal">
          <div className="bulletinboard-modal-content">
            <h2>ניהול הודעות</h2>
            <hr className="bulletinboard-underline" />
            <div className="bulletinboard-options">
              <label>
                <input
                  type="radio"
                  value="add"
                  checked={action === "add"}
                  onChange={() => {
                    setAction("add");
                    setSelectedMessage(null);
                    setNewMessage("");
                    setErrorMessage("");
                  }}
                />
                הוסף הודעה
              </label>
              <label>
                <input
                  type="radio"
                  value="remove"
                  checked={action === "remove"}
                  onChange={() => {
                    setAction("remove");
                    setSelectedMessage(null);
                    setNewMessage("");
                    setErrorMessage("");
                  }}
                />
                מחק הודעה
              </label>
            </div>
            {action === "remove" && (
              <div className="bulletinboard-selection">
                <label>בחר הודעה:</label>
                <select
                  value={selectedMessage ? selectedMessage.id : ""}
                  onChange={(e) =>
                    setSelectedMessage(
                      messages.find((message) => message.id === e.target.value)
                    )
                  }
                  className="bulletinboard-input"
                >
                  <option value="" disabled>
                    בחר הודעה
                  </option>
                  {messages.map((message) => (
                    <option key={message.id} value={message.id}>
                      {message.text}
                    </option>
                  ))}
                </select>
              </div>
            )}
            {(action === "add" || (action === "edit" && selectedMessage)) && (
              <div className="bulletinboard-name-input">
                <label>תוכן ההודעה:</label>
                <textarea
                  value={newMessage}
                  onChange={(e) => setNewMessage(e.target.value)}
                  placeholder="כתוב את ההודעה כאן..."
                  className="bulletinboard-input"
                />
              </div>
            )}
            {errorMessage && <p className="error-message">{errorMessage}</p>}
            <div className="bulletinboard-buttons">
              {action === "add" && (
                <button
                  className="bulletinboard-submit-button"
                  onClick={handleAddMessage}
                >
                  שמור
                </button>
              )}
              {action === "remove" && (
                <button
                  className="bulletinboard-submit-button"
                  onClick={handleRemoveMessage}
                >
                  מחק
                </button>
              )}
              <button
                className="bulletinboard-cancel-button"
                onClick={() => setShowModal(false)}
              >
                סגור
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default BulletinBoard;
