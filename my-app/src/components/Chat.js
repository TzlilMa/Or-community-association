import React, { useEffect, useState } from "react";
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
} from "firebase/firestore";
import { auth, db } from "../fireBase/firebase";
import { useAuthState } from "react-firebase-hooks/auth";
import "../styles/Chat.css"; // Import CSS file

const Chat = () => {
  const [user] = useAuthState(auth);
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState("");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchMessages = async () => {
      setLoading(true);

      try {
        const q = query(collection(db, "messages"), orderBy("timestamp"));
        const querySnapshot = await getDocs(q);

        const fetchedMessages = querySnapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        }));

        // Fetch sender information for each message
        const messagePromises = fetchedMessages.map(async (message) => {
          const senderInfo = await getUserInfo(message.sender);
          return {
            ...message,
            senderFirstName: senderInfo.firstName,
            senderLastName: senderInfo.lastName,
          };
        });

        Promise.all(messagePromises).then((processedMessages) => {
          setMessages(processedMessages);
          setLoading(false);
        });
      } catch (error) {
        console.error("Error fetching messages:", error);
        setLoading(false);
      }
    };

    fetchMessages();

    const q = query(collection(db, "messages"), orderBy("timestamp"));
    const unsubscribe = onSnapshot(q, (snapshot) => {
      snapshot.docChanges().forEach((change) => {
        const message = {
          id: change.doc.id,
          ...change.doc.data(),
        };

        if (change.type === "added") {
          setMessages((prevMessages) => [...prevMessages, message]);
        }
      });
    });

    return () => unsubscribe();
  }, []); // Add dependencies if needed

  const getUserInfo = async (email) => {
    try {
      const userRef = doc(db, "users", email);
      const userDoc = await getDoc(userRef);

      if (userDoc.exists()) {
        return userDoc.data();
      } else {
        console.log("User document not found for email:", email);
        return { firstName: "", lastName: "" }; // Return default values or handle as needed
      }
    } catch (error) {
      console.error("Error fetching user info:", error);
      return { firstName: "", lastName: "" }; // Return default values or handle as needed
    }
  };

  const sendMessage = async (e) => {
    e.preventDefault();
    if (!user || newMessage.trim() === "") return;

    try {
      await addDoc(collection(db, "messages"), {
        sender: user.email,
        content: newMessage,
        timestamp: serverTimestamp(),
      });
      setNewMessage("");
    } catch (error) {
      console.error("Error sending message:", error);
    }
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
                  {new Date(msg.timestamp?.toDate()).toLocaleTimeString()}
                </small>
              </div>
            ))}
          </div>
          <form className="input-area" onSubmit={sendMessage}>
            <input
              type="text"
              value={newMessage}
              onChange={(e) => setNewMessage(e.target.value)}
              placeholder="...כתוב הודעה"
            />
            <button type="submit">שלח</button>
          </form>
        </>
      )}
    </div>
  );
};

export default Chat;
