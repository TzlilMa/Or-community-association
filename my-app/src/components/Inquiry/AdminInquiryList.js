import React, { useState, useEffect } from "react";
import { db } from "../../fireBase/firebase";
import { collection, query, getDocs, doc, addDoc, deleteDoc, where, updateDoc } from "firebase/firestore";
import { useAuth } from "../../fireBase/AuthContext";
import "../../styles/AdminInquiry.css";

const AdminInquiryList = () => {
  const { currentUser } = useAuth();
  const [subjects, setSubjects] = useState([]);
  const [selectedSubject, setSelectedSubject] = useState(null);
  const [inquiries, setInquiries] = useState([]);
  const [selectedInquiry, setSelectedInquiry] = useState(null);
  const [response, setResponse] = useState("");
  const [showWithoutResponse, setShowWithoutResponse] = useState(true);
  const [newSubject, setNewSubject] = useState("");

  useEffect(() => {
    const fetchSubjects = async () => {
      if (currentUser) {
        const q = query(collection(db, "inquirySubject"));
        const querySnapshot = await getDocs(q);
        const subjectsList = querySnapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }));
        setSubjects(subjectsList);
      }
    };

    fetchSubjects();
  }, [currentUser]);

  const fetchInquiries = async (subject) => {
    if (currentUser) {
      const q = query(collection(db, "inquiry"), where("subject", "==", subject));
      const querySnapshot = await getDocs(q);
      const inquiries = querySnapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }));
      inquiries.sort((a, b) => (a.response ? 1 : -1)); // Sort with no response first
      setInquiries(inquiries);
      setSelectedSubject(subject);
    }
  };

  const toggleInquiryDetails = (inquiry) => {
    if (selectedInquiry && selectedInquiry.id === inquiry.id) {
      setSelectedInquiry(null);
    } else {
      setSelectedInquiry(inquiry);
    }
  };

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
      fetchInquiries(selectedSubject);
    } catch (error) {
      console.error("Error submitting response: ", error);
      alert("Error submitting response. Please try again.");
    }
  };

  const handleAddSubject = async () => {
    try {
      await addDoc(collection(db, "inquirySubject"), {
        name: newSubject,
      });
      setNewSubject("");
      alert("Subject added successfully!");
      const q = query(collection(db, "inquirySubject"));
      const querySnapshot = await getDocs(q);
      const subjectsList = querySnapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }));
      setSubjects(subjectsList);
    } catch (error) {
      console.error("Error adding subject: ", error);
      alert("Error adding subject. Please try again.");
    }
  };

  const handleRemoveSubject = async (id) => {
    try {
      await deleteDoc(doc(db, "inquirySubject", id));
      alert("Subject removed successfully!");
      const q = query(collection(db, "inquirySubject"));
      const querySnapshot = await getDocs(q);
      const subjectsList = querySnapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }));
      setSubjects(subjectsList);
    } catch (error) {
      console.error("Error removing subject: ", error);
      alert("Error removing subject. Please try again.");
    }
  };

  return (
    <div className="admin-inquiry-system">
      <div className="admin-inquiry-list">
        <div className="top-bar">
          <button onClick={() => document.getElementById("subject-modal").style.display = "block"}>
            Manage Subjects
          </button>
        </div>
        <h2>רשימת פניות</h2>
        {subjects.map((subject) => (
          <h3 key={subject.id} onClick={() => fetchInquiries(subject.name)} className="subject-name">
            {subject.name}
          </h3>
        ))}
        {selectedSubject && (
          <>
            <div className="response-toggle">
              <span onClick={() => setShowWithoutResponse(true)}>ללא תגובה</span> | 
              <span onClick={() => setShowWithoutResponse(false)}>עם תגובה</span>
            </div>
            <div className="inquiry-section">
              {inquiries
                .filter((inquiry) => showWithoutResponse ? !inquiry.response : inquiry.response)
                .map((inquiry) => (
                  <div key={inquiry.id} className="inquiry-item-container">
                    <div className={`inquiry-item ${selectedInquiry && selectedInquiry.id === inquiry.id ? 'selected' : ''}`} onClick={() => toggleInquiryDetails(inquiry)}>
                      <p>{inquiry.content}</p>
                    </div>
                    {selectedInquiry && selectedInquiry.id === inquiry.id && (
                      <div className="admin-inquiry-detail">
                        <h3>פרטי הפנייה:</h3>
                        <p><strong>נושא:</strong> {selectedInquiry.subject}</p>
                        <p><strong>תוכן הפנייה:</strong> {selectedInquiry.content}</p>
                        <p><strong>שם פרטי:</strong> {selectedInquiry.firstName}</p>
                        <p><strong>שם משפחה:</strong> {selectedInquiry.lastName}</p>
                        <p><strong>אימייל:</strong> {selectedInquiry.email}</p>
                        <form onSubmit={handleResponseSubmit}>
                          <div>
                            <label>כתיבת תגובה:</label>
                            <textarea
                              value={response}
                              onChange={(e) => setResponse(e.target.value)}
                              required
                            ></textarea>
                          </div>
                          <button type="submit">שליחת תגובה</button>
                        </form>
                      </div>
                    )}
                  </div>
                ))}
            </div>
          </>
        )}
      </div>
      <div id="subject-modal" className="modal">
        <div className="modal-content">
          <span className="close" onClick={() => document.getElementById("subject-modal").style.display = "none"}>&times;</span>
          <h3>Manage Subjects</h3>
          <div>
            <input
              type="text"
              value={newSubject}
              onChange={(e) => setNewSubject(e.target.value)}
              placeholder="Add new subject"
            />
            <button onClick={handleAddSubject}>Add Subject</button>
          </div>
          <div>
            <ul>
              {subjects.map((subject) => (
                <li key={subject.id}>
                  {subject.name}
                  <button onClick={() => handleRemoveSubject(subject.id)}>Remove</button>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminInquiryList;
