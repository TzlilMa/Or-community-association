// src/components/inquiry/AdminInquiryList.js
import React, { useState, useEffect } from "react";
import { db } from "../../fireBase/firebase";
import { collection, query, where, getDocs, doc, updateDoc } from "firebase/firestore";
import { useAuth } from "../../fireBase/AuthContext";
import "../../styles/AdminInquiry.css";

const AdminInquiryList = () => {
  const { currentUser } = useAuth();
  const [subject, setSubject] = useState("");
  const [inquiries, setInquiries] = useState([]);
  const [selectedInquiry, setSelectedInquiry] = useState(null);
  const [response, setResponse] = useState("");

  useEffect(() => {
    if (subject) {
      const fetchInquiries = async () => {
        const q = query(
          collection(db, "inquiries"),
          where("subject", "==", subject),
          where("response", "==", "")
        );
        const querySnapshot = await getDocs(q);
        setInquiries(
          querySnapshot.docs.map((doc) => ({ ...doc.data(), id: doc.id }))
        );
      };

      fetchInquiries();
    }
  }, [subject]);

  const handleResponseSubmit = async (e) => {
    e.preventDefault();
    try {
      const inquiryRef = doc(db, "inquiries", selectedInquiry.id);
      await updateDoc(inquiryRef, {
        response: response,
      });
      alert("Response submitted successfully!");
      setResponse("");
      setSelectedInquiry(null);
      // Refresh inquiries after response submission
      const q = query(
        collection(db, "inquiries"),
        where("subject", "==", subject),
        where("response", "==", "")
      );
      const querySnapshot = await getDocs(q);
      setInquiries(
        querySnapshot.docs.map((doc) => ({ ...doc.data(), id: doc.id }))
      );
    } catch (error) {
      console.error("Error submitting response: ", error);
      alert("Error submitting response. Please try again.");
    }
  };

  return (
    <div className="admin-inquiry-system">
      <div className="admin-inquiry-list">
        <h2>Admin Inquiry List</h2>
        <div>
          <label>Select Subject:</label>
          <input
            type="text"
            value={subject}
            onChange={(e) => setSubject(e.target.value)}
            required
          />
        </div>
        <div>
          {inquiries.map((inquiry) => (
            <div key={inquiry.id} onClick={() => setSelectedInquiry(inquiry)}>
              <h3>{inquiry.subject}</h3>
              <p>{inquiry.content}</p>
            </div>
          ))}
        </div>
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
