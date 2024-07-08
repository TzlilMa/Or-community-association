import React, { useState, useEffect } from "react";
import { db, auth, getDoc, collection, query, getDocs, addDoc, deleteDoc, doc, orderBy } from "../../fireBase/firebase";
import "../../styles/BulletinBoard.css";

const BulletinBoard = () => {
  const [isAdmin, setIsAdmin] = useState(false);
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState("");
  const [showModal, setShowModal] = useState(false);
  const [action, setAction] = useState("");
  const [selectedMessage, setSelectedMessage] = useState(null);

  useEffect(() => {
    fetchNotifications();
    fetchUser();
  }, []);

  const fetchNotifications = async () => {
    try {
      const q = query(collection(db, "bulletinBoard"), orderBy("timestamp", "desc"));
      const querySnapshot = await getDocs(q);
      setMessages(querySnapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() })));
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
          <button className="bulletinboard-management-button" onClick={() => setShowModal(true)}>
            ניהול הודעות
          </button>
        )}
        <ul className="ads">
          {messages.map((message) => (
            <li key={message.id}>
              {message.text}
            </li>
          ))}
        </ul>
      </div>

      {showModal && (
        <div className="bulletinboard-modal">
          <div className="bulletinboard-modal-content">
            <h3>ניהול הודעות</h3>
            <div className="bulletinboard-actions">
              <button onClick={() => setAction("add")}>הוסף הודעה</button>
              <button onClick={() => setAction("remove")}>מחק הודעה</button>
            </div>
            {action === "remove" && (
              <select
                value={selectedMessage ? selectedMessage.id : ""}
                onChange={(e) => setSelectedMessage(messages.find((message) => message.id === e.target.value))}
              >
                <option value="" disabled>בחר הודעה</option>
                {messages.map((message) => (
                  <option key={message.id} value={message.id}>{message.text}</option>
                ))}
              </select>
            )}
            {action === "add" && (
              <textarea
                value={newMessage}
                onChange={(e) => setNewMessage(e.target.value)}
                placeholder="Write your message here..."
              />
            )}
            {(action === "add" || action === "remove") && (
              <div className="bulletinboard-modal-buttons">
                {action === "add" && <button onClick={handleAddMessage}>שמור</button>}
                {action === "remove" && <button onClick={handleRemoveMessage}>מחק</button>}
                <button onClick={() => setShowModal(false)}>סגור</button>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default BulletinBoard;
