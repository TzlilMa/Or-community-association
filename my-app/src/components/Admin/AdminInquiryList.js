import React, { useState, useEffect } from "react";
import { db } from "../../fireBase/firebase";
import { collection, query, getDocs, doc, addDoc, deleteDoc, where, updateDoc } from "firebase/firestore";
import { useAuth } from "../../fireBase/AuthContext";
import Notification from '../Genral/Notification';
import "../../styles/AdminInquiry.css";

const AdminInquiryList = () => {
  const { currentUser } = useAuth();
  const [subjects, setSubjects] = useState([]);
  const [selectedSubject, setSelectedSubject] = useState(null);
  const [inquiries, setInquiries] = useState([]);
  const [selectedInquiry, setSelectedInquiry] = useState(null);
  const [response, setResponse] = useState("");
  const [showWithoutResponse, setShowWithoutResponse] = useState(true);
  const [showSubjectModal, setShowSubjectModal] = useState(false);
  const [subjectAction, setSubjectAction] = useState("");
  const [newSubject, setNewSubject] = useState("");
  const [editSubject, setEditSubject] = useState(null);
  const [notification, setNotification] = useState({ message: '', type: '' });

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
      const q = query(collection(db, "inquiry"), where("subject", "==", subject.name));
      const querySnapshot = await getDocs(q);
      const inquiriesData = querySnapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }));

      // Fetch user details for each inquiry
      const inquiriesWithUserDetails = await Promise.all(
        inquiriesData.map(async (inquiry) => {
          const userQuery = query(collection(db, "users"), where("email", "==", inquiry.email));
          const userQuerySnapshot = await getDocs(userQuery);
          const userData = userQuerySnapshot.docs[0]?.data();
          return {
            ...inquiry,
            firstName: userData?.firstName || "Unknown",
            lastName: userData?.lastName || "Unknown",
          };
        })
      );

      inquiriesWithUserDetails.sort((a, b) => (a.response ? 1 : -1)); // Sort with no response first
      setInquiries(inquiriesWithUserDetails);
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
        responseDate: new Date().toISOString(), // Add response date
      });
      setNotification({ message: 'תגובה נשלחה בהצלחה', type: 'success' });
      setResponse("");
      setSelectedInquiry(null);
      fetchInquiries(selectedSubject);
    } catch (error) {
      console.error("Error submitting response: ", error);
      setNotification({ message: 'תגובתך לא התקבלה במערכת', type: 'error' });
    }
  };

  const handleSubjectManagement = async () => {
    try {
      if (subjectAction === "add") {
        await addDoc(collection(db, "inquirySubject"), { name: newSubject });
      } else if (subjectAction === "edit") {
        const subjectRef = doc(db, "inquirySubject", editSubject.id);
        await updateDoc(subjectRef, { name: newSubject });
      } else if (subjectAction === "remove") {
        const subjectRef = doc(db, "inquirySubject", editSubject.id);
        await deleteDoc(subjectRef);
      }
      alert("Subject management action completed successfully!");
      setShowSubjectModal(false);
      setNewSubject("");
      setEditSubject(null);
      const q = query(collection(db, "inquirySubject"));
      const querySnapshot = await getDocs(q);
      const subjectsList = querySnapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }));
      setSubjects(subjectsList);
    } catch (error) {
      console.error("Error managing subject: ", error);
      alert("Error managing subject. Please try again.");
    }
  };

  return (
    <div className="admin-inquiry-system">
      <div className="admin-inquiry-list">
        <h2>רשימת פניות</h2>
        {subjects.map((subject) => (
          <h3
            key={subject.id}
            onClick={() => fetchInquiries(subject)}
            className={`subject-name ${selectedSubject && selectedSubject.id === subject.id ? 'selected' : ''}`}
          >
            {subject.name}
          </h3>
        ))}
        <button className="subject-management-button" onClick={() => setShowSubjectModal(true)}>
          ניהול נושאים
        </button>
        {selectedSubject && (
          <>
            <div className="response-toggle">
              <span
                onClick={() => setShowWithoutResponse(true)}
                className={showWithoutResponse ? 'selected' : ''}
              >
                ללא תגובה
              </span> | 
              <span
                onClick={() => setShowWithoutResponse(false)}
                className={!showWithoutResponse ? 'selected' : ''}
              >
                עם תגובה
              </span>
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
                        <p><strong>תאריך הגשה:</strong> {new Date(selectedInquiry.submitDate).toLocaleString()}</p> {/* Display submit date */}
                        {selectedInquiry.response ? (
                          <>
                            <p><strong>תגובה:</strong> {selectedInquiry.response}</p>
                            <p><strong>תאריך תגובה:</strong> {new Date(selectedInquiry.responseDate).toLocaleString()}</p> {/* Display response date */}
                          </>
                        ) : (
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
                        )}
                      </div>
                    )}
                  </div>
                ))}
            </div>
          </>
        )}
      </div>

      {showSubjectModal && (
        <div className="subject-modal">
          <div className="subject-modal-content">
            <h3>ניהול נושאים</h3>
            <div className="subject-actions">
              <button onClick={() => setSubjectAction("add")}>הוסף נושא</button>
              <button onClick={() => setSubjectAction("edit")}>ערוך נושא</button>
              <button onClick={() => setSubjectAction("remove")}>מחק נושא</button>
            </div>
            {subjectAction && (
              <>
                {subjectAction !== "add" && (
                  <select
                    value={editSubject ? editSubject.id : ""}
                    onChange={(e) => setEditSubject(subjects.find((subject) => subject.id === e.target.value))}
                  >
                    <option value="" disabled>בחר נושא</option>
                    {subjects.map((subject) => (
                      <option key={subject.id} value={subject.id}>{subject.name}</option>
                    ))}
                  </select>
                )}
                {subjectAction === "add" || (subjectAction === "edit" && editSubject) ? (
                  <input
                    type="text"
                    placeholder="שם נושא"
                    value={newSubject}
                    onChange={(e) => setNewSubject(e.target.value)}
                  />
                ) : null}
                <div className="modal-buttons">
                  <button onClick={handleSubjectManagement}>שמור</button>
                  <button onClick={() => setShowSubjectModal(false)}>סגור</button>
                </div>
              </>
            )}
          </div>
        </div>
      )}
      {notification.message && (
        <Notification
          message={notification.message}
          type={notification.type}
          onClose={() => setNotification({ message: '', type: '' })}
        />
      )}
    </div>
  );
};

export default AdminInquiryList;
