import React, { useState, useEffect } from 'react';
import { db, collection, query, where, getDocs } from '../fireBase/firebase';
import '../styles/ChatLog.css';

const ChatLog = ({ email, onClose }) => {
  const [messages, setMessages] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchMessages = async () => {
      try {
        const q = query(collection(db, 'messages'), where('sender', '==', email));
        const querySnapshot = await getDocs(q);
        const msgs = querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
        setMessages(msgs);
        setLoading(false);
      } catch (error) {
        console.error('Error fetching chat log:', error);
        setLoading(false);
      }
    };

    fetchMessages();
  }, [email]);

  const formatDate = (timestamp) => {
    if (!timestamp) return 'N/A';
    return new Date(timestamp.seconds * 1000).toLocaleString();
  };

  return (
    <div className="chat-log">
      <button onClick={onClose}>Close</button>
      <h2>Chat Log for {email}</h2>
      {loading ? (
        <p>Loading...</p>
      ) : (
        <table>
          <thead>
            <tr>
              <th>Time</th>
              <th>Content</th>
            </tr>
          </thead>
          <tbody>
            {messages.map(message => (
              <tr key={message.id}>
                <td>{formatDate(message.timestamp)}</td>
                <td>{message.content}</td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
};

export default ChatLog;
