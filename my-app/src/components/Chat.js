import React, { useEffect, useState, useRef } from "react";
import {
  collection,
  addDoc,
  query,
  orderBy,
  onSnapshot,
  serverTimestamp,
  doc,
  getDocs,
  getDoc,
  where,
  Timestamp,
} from "firebase/firestore";
import { auth, db } from "../fireBase/firebase";
import { useAuthState } from "react-firebase-hooks/auth";
import "../styles/Chat.css"; // Import CSS file

const Chat = () => {
  const [user] = useAuthState(auth);
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState("");
  const [loading, setLoading] = useState(true);
  const [ipAddress, setIpAddress] = useState("");
  const conversationEndRef = useRef(null); // Reference to the end of the conversation
  const userCache = useRef({}); // Cache for user info
  const initialLoad = useRef(true); // Ref to track initial load

  useEffect(() => {
    const fetchIpAddress = async () => {
      try {
        const ip = await fetch("https://api64.ipify.org?format=json")
          .then((response) => response.json())
          .then((data) => data.ip);
        setIpAddress(ip);
      } catch (error) {
        console.error("Error fetching IP address:", error);
      }
    };

    fetchIpAddress();

    const fetchMessages = async () => {
      setLoading(true);

      try {
        const now = new Date();
        const twentyFourHoursAgo = new Date(now.getTime() - 24 * 60 * 60 * 1000);
        const timestamp24HoursAgo = Timestamp.fromDate(twentyFourHoursAgo);

        const q = query(
          collection(db, "messages"),
          where("timestamp", ">", timestamp24HoursAgo),
          orderBy("timestamp")
        );

        const querySnapshot = await getDocs(q);

        const fetchedMessages = await Promise.all(
          querySnapshot.docs.map(async (doc) => {
            const message = { id: doc.id, ...doc.data() };
            const senderInfo = await getCachedUserInfo(message.sender);
            return {
              ...message,
              senderFirstName: senderInfo.firstName,
              senderLastName: senderInfo.lastName,
            };
          })
        );

        setMessages(fetchedMessages);
        setLoading(false);
        scrollToBottom(true); // Scroll to the latest message on initial load
      } catch (error) {
        console.error("Error fetching messages:", error);
        setLoading(false);
      }
    };

    fetchMessages();

    const now = new Date();
    const twentyFourHoursAgo = new Date(now.getTime() - 24 * 60 * 60 * 1000);
    const timestamp24HoursAgo = Timestamp.fromDate(twentyFourHoursAgo);
    const q = query(
      collection(db, "messages"),
      where("timestamp", ">", timestamp24HoursAgo),
      orderBy("timestamp")
    );

    const unsubscribe = onSnapshot(q, (snapshot) => {
      snapshot.docChanges().forEach(async (change) => {
        if (change.type === "added") {
          const newMessageData = {
            id: change.doc.id,
            ...change.doc.data(),
          };

          const senderInfo = await getCachedUserInfo(newMessageData.sender);
          const processedMessage = {
            ...newMessageData,
            senderFirstName: senderInfo.firstName,
            senderLastName: senderInfo.lastName,
          };

          setMessages((prevMessages) => {
            const updatedMessages = prevMessages.filter(
              (msg) => !(msg.content === processedMessage.content && msg.sender === processedMessage.sender)
            );
            return [...updatedMessages, processedMessage];
          });
          scrollToBottom(false); // Do not scroll automatically when new message is added
        }
      });
    });

    return () => unsubscribe();
  }, []); // Fetch only once on component mount

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
      } else {
        console.log("User document not found for email:", email);
        return { firstName: "Unknown", lastName: "" };
      }
    } catch (error) {
      console.error("Error fetching user info:", error);
      return { firstName: "Unknown", lastName: "" };
    }
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
    };

    setMessages((prevMessages) => [...prevMessages, optimisticMessage]);
    scrollToBottom(false);

    try {
      await addDoc(collection(db, "messages"), {
        sender: user.email,
        content: newMessage,
        timestamp: serverTimestamp(),
        ipAddress: ipAddress,
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
        // Scroll to the bottom on initial load
        conversationEndRef.current.scrollIntoView({ behavior: "auto" });
        initialLoad.current = false;
      } else if (!initialLoad.current) {
        // For new messages, make sure to only scroll if not initial load
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
    <div className="chat-container">
      {loading ? (
        <p>...טוען הודעות</p>
      ) : (
        <>
          <div className="conversation">
            {messages.map((msg) => (
              <div
                key={msg.id}
                className={`message ${
                  msg.sender === user.email ? "sent" : "received"
                }`}
              >
                <p>{msg.content}</p>
                <small>
                  {msg.senderFirstName} {msg.senderLastName} @{" "}
                  {formatDate(msg.timestamp)}
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
  );
};

export default Chat;
