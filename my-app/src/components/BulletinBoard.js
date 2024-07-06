// src/components/BulletinBoard.js
import React, { useState, useEffect } from "react";
import { db, auth, getDoc, doc } from "../fireBase/firebase";
import "../styles/BulletinBoard.css";

const BulletinBoard = ({ showEditButtons }) => {
  const [isAdmin, setIsAdmin] = useState(false);
  const [messages, setMessages] = useState([
    "הודעה 1",
    "הודעה 2",
    "הודעה 3",
    "הודעה 4",
    "הודעה 5",
    "הודעה 6",
    "הודעה 7",
  ]);

  useEffect(() => {
    const fetchUser = async () => {
      const user = auth.currentUser;
      if (user) {
        const userDoc = await getDoc(doc(db, "users", user.uid));
        if (userDoc.exists()) {
          const userData = userDoc.data();
          console.log("User Data:", userData);
          setIsAdmin(userData.isAdmin);
        }
      }
    };

    fetchUser();
  }, []);

  const handleEdit = (index) => {
    const newMessage = prompt("Edit the message:", messages[index]);
    if (newMessage !== null) {
      setMessages((prevMessages) => {
        const newMessages = [...prevMessages];
        newMessages[index] = newMessage;
        return newMessages;
      });
    }
  };

  return (
    <div className="bulletin-board">
      <div className="ads">
        <ul>
          {messages.map((message, index) => (
            <li key={index}>
              {message}
              {isAdmin && showEditButtons && (
                <button onClick={() => handleEdit(index)}>Edit</button>
              )}
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
};

export default BulletinBoard;
