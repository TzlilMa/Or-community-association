import React, { useEffect, useState, useRef } from "react";
import { collection, addDoc, query, orderBy, onSnapshot, serverTimestamp, doc, getDoc, where, Timestamp } from "firebase/firestore";
import { auth, db } from "../fireBase/firebase";
import { useAuthState } from "react-firebase-hooks/auth";
import { Spinner } from "react-bootstrap";
import "bootstrap/dist/css/bootstrap.min.css"; // Import Bootstrap CSS
import "../styles/Chat.css";
import axios from 'axios';

const Chat = () => {
  const [user] = useAuthState(auth);
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState("");
  const [loading, setLoading] = useState(true);
  const [sessionIp, setSessionIp] = useState('');
  const conversationEndRef = useRef(null);
  const userCache = useRef({});

  useEffect(() => {
    // Get user's IP address
    const fetchIp = async () => {
      try {
        const response = await axios.get('https://api.ipify.org?format=json');
        setSessionIp(response.data.ip);
      } catch (error) {
        console.error('Error fetching IP:', error);
      }
    };

    fetchIp();

    const now = new Date();
    const twentyFourHoursAgo = new Date(now.getTime() - 24 * 60 * 60 * 1000);
    const timestamp24HoursAgo = Timestamp.fromDate(twentyFourHoursAgo);

    const q = query(
      collection(db, "messages"),
      where("timestamp", ">", timestamp24HoursAgo),
      orderBy("timestamp")
    );

    const unsubscribe = onSnapshot(q, async (snapshot) => {
      const newMessages = await Promise.all(
        snapshot.docs.map(async (doc) => {
          const messageData = doc.data();
          const senderInfo = await getCachedUserInfo(messageData.sender);
          return {
            id: doc.id,
            ...messageData,
            senderFirstName: senderInfo.firstName,
            senderLastName: senderInfo.lastName,
          };
        })
      );
      setMessages(newMessages);
      scrollToBottom(true);
      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  const getCachedUserInfo = async (email) => {
    if (userCache.current[email]) {
      return userCache.current[email];
    }
    try {
      const userRef = doc(db, "users", email);
      const userDoc = await getDoc(userRef);
      if (userDoc.exists()) {
        const userInfo = userDoc.data();
        userCache.current[email] = userInfo;
        return userInfo;
      }
    } catch (error) {
      console.error("Error fetching user info:", error);
    }
    return { firstName: "Unknown", lastName: "" };
  };

  const sendMessage = async (e) => {
    e.preventDefault();
    if (!user || newMessage.trim() === "") return;

    const tempId = `temp-${Date.now()}`;
    const displayName = user.displayName || "Unknown User";
    const [firstName, lastName] = displayName.split(" ").length > 1
      ? displayName.split(" ")
      : [displayName, ""];

    const optimisticMessage = {
      id: tempId,
      sender: user.email,
      content: newMessage,
      timestamp: new Date(),
      senderFirstName: firstName,
      senderLastName: lastName,
      ip: sessionIp,
      port: window.location.port
    };

    setMessages((prevMessages) => [...prevMessages, optimisticMessage]);
    scrollToBottom(false);

    try {
      await addDoc(collection(db, "messages"), {
        sender: user.email,
        content: newMessage,
        timestamp: serverTimestamp(),
        ip: sessionIp,
        port: window.location.port
      });
    } catch (error) {
      console.error("Error sending message:", error);
    } finally {
      setNewMessage("");
    }
  };

  const scrollToBottom = (initial) => {
    if (conversationEndRef.current) {
      if (initial) {
        conversationEndRef.current.scrollIntoView({ behavior: "auto" });
      } else {
        conversationEndRef.current.scrollIntoView({ behavior: "smooth" });
      }
    }
  };

  const formatDate = (timestamp) => {
    if (!timestamp) return "Loading...";
    const date = timestamp.toDate ? timestamp.toDate() : timestamp;
    return new Date(date).toLocaleTimeString();
  };

  return (
    <div className="chat-background">
      <div className="chat-container">
        {loading ? (
          <div className="spinner-container">
            <Spinner animation="border" variant="primary" />
            <p>...טוען הודעות</p>
          </div>
        ) : (
          <>
            <div className="conversation">
              {messages.map((msg) => (
                <div
                  key={msg.id}
                  className={`message ${msg.sender === user.email ? "sent" : "received"}`}
                >
                  <p>{msg.content}</p>
                  <small>
                    {msg.senderFirstName} {msg.senderLastName} @ {formatDate(msg.timestamp)}
                  </small>
                </div>
              ))}
              <div ref={conversationEndRef} />
            </div>
            <form className="input-area-chat" onSubmit={sendMessage}>
              <input
                type="text"
                value={newMessage}
                onChange={(e) => setNewMessage(e.target.value)}
                placeholder="הקלד הודעה חדשה..."
              />
              <button type="submit">שלח</button>
            </form>
          </>
        )}
      </div>
    </div>
  );
};

export default Chat;
