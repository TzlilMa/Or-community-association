// src/components/inquiry/InquiryForm.js
import React, { useState } from 'react';
import { db } from '../../fireBase/firebase';
import { addDoc, collection } from 'firebase/firestore';
import { useAuth } from '../../fireBase/AuthContext';
import AdminInquiryList from './AdminInquiryList';
import '../../styles/InquiryForm.css'; // Corrected path

const InquiryForm = () => {
  const { currentUser } = useAuth();
  const [subject, setSubject] = useState('');
  const [content, setContent] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      await addDoc(collection(db, 'inquiry'), { // Corrected collection name
        email: currentUser.email,
        subject: subject,
        content: content,
        response: ''
      });
      setSubject('');
      setContent('');
      alert('Inquiry submitted successfully!');
    } catch (error) {
      console.error('Error submitting inquiry: ', error);
      alert('Error submitting inquiry. Please try again.');
    }
  };

  return (
    <div>
      {currentUser?.isAdmin ? (
        <AdminInquiryList />
      ) : (
        <div className="inquiry-form">
          <h2>Submit an Inquiry</h2>
          <form onSubmit={handleSubmit}>
            <div>
              <label>Subject:</label>
              <input type="text" value={subject} onChange={(e) => setSubject(e.target.value)} required />
            </div>
            <div>
              <label>Content:</label>
              <textarea value={content} onChange={(e) => setContent(e.target.value)} required></textarea>
            </div>
            <button type="submit">Submit Inquiry</button>
          </form>
        </div>
      )}
    </div>
  );
};

export default InquiryForm;
