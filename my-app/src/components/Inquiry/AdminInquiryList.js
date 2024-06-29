// src/components/inquiry/AdminInquiryList.js
import React, { useState, useEffect } from "react";
import { db } from "../../fireBase/firebase";
import { collection, query, where, getDocs, doc, updateDoc } from "firebase/firestore";
import { useAuth } from "../../fireBase/AuthContext";
import "../../styles/AdminInquiry.css";

const AdminInquiryList = () => {
  const { currentUser } = useAuth();
  const [inquiries, setInquiries] = useState({});
  const [selectedInquiry, setSelectedInquiry] = useState(null);
  const [response, setResponse] = useState("");

  useEffect(() => {
    const fetchInquiries = async () => {
      if (currentUser) {
        const q = query(
          collection(db, "inquiry"),
          where("response", "==", null)
        );
        const querySnapshot = await getDocs(q);
        const inquiriesBySubject = {};
        querySnapshot.docs.forEach((doc) => {
          const inquiry = { id: doc.id, ...doc.data() };
          if (!inquiriesBySubject[inquiry.subject]) {
            inquiriesBySubject[inquiry.subject] = [];
          }
          inquiriesBySubject[inquiry.subject].push(inquiry);
        });
        setInquiries(inquiriesBySubject);
      }
    };

    fetchInquiries();
  }, [currentUser]);

  const handleResponseSubmit = async (e) => {
    e.preventDefault();
    try {
      const inquiryRef = doc(db, "inquiry", selectedInquiry.id);
      await updateDoc(inquiryRef, {
        response: response,
      });
      alert("Response submitted successfully!");
      setResponse("");
      setSelectedInquiry(null);
      // Refresh inquiries after response submission
      const q = query(
        collection(db, "inquiry"),
        where("response", "==", null)
      );
      const querySnapshot = await getDocs(q);
      const inquiriesBySubject = {};
      querySnapshot.docs.forEach((doc) => {
        const inquiry = { id: doc.id, ...doc.data() };
        if (!inquiriesBySubject[inquiry.subject]) {
          inquiriesBySubject[inquiry.subject] = [];
        }
        inquiriesBySubject[inquiry.subject].push(inquiry);
      });
      setInquiries(inquiriesBySubject);
    } catch (error) {
      console.error("Error submitting response: ", error);
      alert("Error submitting response. Please try again.");
    }
  };

  return (
    <div className="admin-inquiry-system">
      <div className="admin-inquiry-list">
        <h2>Admin Inquiry List</h2>
        {Object.keys(inquiries).map((subject) => (
          <div key={subject}>
            <h3>{subject}</h3>
            {inquiries[subject].map((inquiry) => (
              <div key={inquiry.id} className="inquiry-item" onClick={() => setSelectedInquiry(inquiry)}>
                <p>{inquiry.content}</p>
              </div>
            ))}
          </div>
        ))}
      </div>
      {selectedInquiry && (
        <div className="admin-inquiry-detail">
          <h3>Inquiry Detail</h3>
          <p>
            <strong>Subject:</strong> {selectedInquiry.subject}
          </p>
          <p>
            <strong>Content:</strong> {selectedInquiry.content}
          </p>
          <form onSubmit={handleResponseSubmit}>
            <div>
              <label>Response:</label>
              <textarea
                value={response}
                onChange={(e) => setResponse(e.target.value)}
                required
              ></textarea>
            </div>
            <button type="submit">Submit Response</button>
          </form>
        </div>
      )}
    </div>
  );
};

export default AdminInquiryList;
