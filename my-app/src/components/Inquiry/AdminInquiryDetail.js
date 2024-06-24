// src/components/inquiry/AdminInquiryDetail.js
import React, { useState } from "react";
import { db } from "../../fireBase/firebase";
import { doc, updateDoc } from "firebase/firestore";
import "../../styles/InquiryForm.css"; // Corrected path

const AdminInquiryDetail = ({ inquiry }) => {
  const [response, setResponse] = useState("");

  const handleResponseSubmit = async (e) => {
    e.preventDefault();

    try {
      const inquiryRef = doc(db, "inquiries", inquiry.id);
      await updateDoc(inquiryRef, {
        response: response,
      });
      alert("Response submitted successfully!");
    } catch (error) {
      console.error("Error submitting response: ", error);
      alert("Error submitting response. Please try again.");
    }
  };

  return (
    <div className="admin-inquiry-detail">
      <h3>Inquiry Detail</h3>
      <p>
        <strong>Subject:</strong> {inquiry.subject}
      </p>
      <p>
        <strong>Content:</strong> {inquiry.content}
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
  );
};

export default AdminInquiryDetail;
