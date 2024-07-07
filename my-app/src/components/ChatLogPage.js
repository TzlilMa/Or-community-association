import React, { useState, useEffect } from 'react';
import { db, collection, query, where, getDocs, orderBy } from '../fireBase/firebase';
import { useParams } from 'react-router-dom';
import '../styles/ChatLog.css';

const ChatLogPage = () => {
  const { email } = useParams();
  const [messages, setMessages] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchMessages = async () => {
      try {
        const q = query(
          collection(db, 'messages'),
          where('sender', '==', email),
          orderBy('timestamp')
        );
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
      <h2>היסטוריית שיחת צ'אט עבור  {email}</h2>
      {loading ? (
        <p>Loading...</p>
      ) : (
        <table>
          <thead>
            <tr>
              <th>תאריך ושעה</th>
              <th>תוכן ההודעה</th>
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

export default ChatLogPage;
