// src/components/inquiry/AdminInquiryList.js
import React, { useState, useEffect } from 'react';
import { db } from '../../fireBase/firebase';
import { collection, query, where, getDocs } from 'firebase/firestore';
import { useAuth } from '../../fireBase/AuthContext';
import AdminInquiryDetail from './AdminInquiryDetail';
import '../../styles/InquiryForm.css'; // Corrected path

const AdminInquiryList = () => {
  const { currentUser } = useAuth();
  const [subject, setSubject] = useState('');
  const [inquiries, setInquiries] = useState([]);
  const [selectedInquiry, setSelectedInquiry] = useState(null);

  useEffect(() => {
    if (subject) {
      const fetchInquiries = async () => {
        const q = query(collection(db, 'inquiries'), where('subject', '==', subject), where('response', '==', ''));
        const querySnapshot = await getDocs(q);
        setInquiries(querySnapshot.docs.map(doc => ({ ...doc.data(), id: doc.id })));
      };

      fetchInquiries();
    }
  }, [subject]);

  return (
    <div className="admin-inquiry-list">
      <h2>Admin Inquiry List</h2>
      <div>
        <label>Select Subject:</label>
        <input type="text" value={subject} onChange={(e) => setSubject(e.target.value)} required />
      </div>
      <div>
        {inquiries.map((inquiry) => (
          <div key={inquiry.id} onClick={() => setSelectedInquiry(inquiry)}>
            <h3>{inquiry.subject}</h3>
            <p>{inquiry.content}</p>
          </div>
        ))}
      </div>
      {selectedInquiry && <AdminInquiryDetail inquiry={selectedInquiry} />}
    </div>
  );
};

export default AdminInquiryList;
