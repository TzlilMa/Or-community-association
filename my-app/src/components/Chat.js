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
        // Calculate the timestamp for 24 hours ago
        const now = new Date();
        const twentyFourHoursAgo = new Date(now.setDate(now.getDate() - 1));

        // Convert to Firebase Timestamp
        const timestamp24HoursAgo = Timestamp.fromDate(twentyFourHoursAgo);

        // Query for messages in the last 24 hours
        const q = query(
          collection(db, "messages"),
          where("timestamp", ">", timestamp24HoursAgo),
          orderBy("timestamp")
        );

        const querySnapshot = await getDocs(q);

        const fetchedMessages = querySnapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        }));

        // Fetch sender information for each message
        const messagePromises = fetchedMessages.map(async (message) => {
          const senderInfo = await getCachedUserInfo(message.sender);
          return {
            ...message,
            senderFirstName: senderInfo.firstName,
            senderLastName: senderInfo.lastName,
          };
        });

        Promise.all(messagePromises).then((processedMessages) => {
          setMessages(processedMessages);
          setLoading(false);
          scrollToBottom(); // Scroll to the latest message
        });
      } catch (error) {
        console.error("Error fetching messages:", error);
        setLoading(false);
      }
    };

    fetchMessages();

    // Listen for new messages in real-time
    const now = new Date();
    const twentyFourHoursAgo = new Date(now.setDate(now.getDate() - 1));
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

          setMessages((prevMessages) => [...prevMessages, processedMessage]);
          scrollToBottom(); // Scroll to the latest message
        }
      });
    });

    return () => unsubscribe();
  }, []); // Add dependencies if needed

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
        return { firstName: "Unknown", lastName: "" }; // Return default values or handle as needed
      }
    } catch (error) {
      console.error("Error fetching user info:", error);
      return { firstName: "Unknown", lastName: "" }; // Return default values or handle as needed
    }
  };

  const sendMessage = async (e) => {
    e.preventDefault();
    if (!user || newMessage.trim() === "") return;

    // Get or create a display name
    const displayName = user.displayName || "Unknown User";
    const [firstName, lastName] = displayName.split(" ").length > 1 
      ? displayName.split(" ")
      : [displayName, ""];

    // Optimistically update the UI
    const optimisticMessage = {
      id: `temp-${Date.now()}`,
      sender: user.email,
      content: newMessage,
      timestamp: new Date(), // Use local time for optimistic update
      senderFirstName: firstName,
      senderLastName: lastName,
    };

    setMessages((prevMessages) => [...prevMessages, optimisticMessage]);
    scrollToBottom();

    try {
      await addDoc(collection(db, "messages"), {
        sender: user.email,
        content: newMessage,
        timestamp: serverTimestamp(),
        ipAddress: ipAddress,
      });
      setNewMessage("");
    } catch (error) {
      console.error("Error sending message:", error);
    }
  };

  const scrollToBottom = () => {
    if (conversationEndRef.current) {
      conversationEndRef.current.scrollIntoView({ behavior: "smooth" });
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
        <p>Loading messages...</p>
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
              placeholder="Write a message..."
            />
            <button type="submit">Send</button>
          </form>
        </>
      )}
    </div>
  );
};

export default Chat;
