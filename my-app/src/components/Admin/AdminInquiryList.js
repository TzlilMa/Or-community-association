import React, { useState, useEffect } from "react";
import { db } from "../../fireBase/firebase";
import { collection, query, getDocs, doc, addDoc, deleteDoc, where, updateDoc } from "firebase/firestore";
import { useAuth } from "../../fireBase/AuthContext";
import Notification from '../General/Notification';
import ReactQuill from "react-quill";
import "react-quill/dist/quill.snow.css";
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
  const [subjectAction, setSubjectAction] = useState("add");
  const [newSubject, setNewSubject] = useState("");
  const [editSubject, setEditSubject] = useState(null);
  const [notification, setNotification] = useState({ message: '', type: '' });
  const [errorMessage, setErrorMessage] = useState("");
  const [loading, setLoading] = useState(true); // Loading state

  const modules = {
    toolbar: false // Disable toolbar for read-only mode
  };

  useEffect(() => {
    const fetchSubjects = async () => {
      setLoading(true); // Start loading
      if (currentUser) {
        try {
          const q = query(collection(db, "inquirySubject"));
          const querySnapshot = await getDocs(q);
          const subjectsList = querySnapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }));
          setSubjects(subjectsList);
        } catch (error) {
          console.error("Error fetching subjects: ", error);
        } finally {
          setLoading(false); // Stop loading
        }
      }
    };

    fetchSubjects();
  }, [currentUser]);

  const fetchInquiries = async (subject) => {
    if (currentUser) {
      try {
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
      } catch (error) {
        console.error("Error fetching inquiries: ", error);
      }
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
    const trimmedResponse = response.trim(); // Trim the response

    if (!trimmedResponse) {
      setNotification({ message: 'לא ניתן לשלוח תגובה ריקה', type: 'error' });
      return;
    }

    setLoading(true); // Start loading
    try {
      const inquiryRef = doc(db, "inquiry", selectedInquiry.id);
      await updateDoc(inquiryRef, {
        response: trimmedResponse,
        responseDate: new Date().toISOString(), // Add response date
      });
      setNotification({ message: 'תגובה נשלחה בהצלחה', type: 'success' });
      setResponse("");
      setSelectedInquiry(null);
      fetchInquiries(selectedSubject);
    } catch (error) {
      console.error("Error submitting response: ", error);
      setNotification({ message: 'תגובתך לא התקבלה במערכת', type: 'error' });
    } finally {
      setLoading(false); // Stop loading
    }
  };

  const handleSubjectManagement = async () => {
    if ((subjectAction === "edit" || subjectAction === "remove") && !editSubject) {
      setErrorMessage("אנא בחר נושא מהרשימה");
      return;
    }

    if ((subjectAction === "add" || subjectAction === "edit") && !newSubject.trim()) {
      setErrorMessage("אנא מלא את שם הנושא");
      return;
    }

    setLoading(true); // Start loading
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
      setNotification({ message: 'הפעולה הושלמה בהצלחה!', type: 'success' });
      setShowSubjectModal(false);
      setNewSubject("");
      setEditSubject(null);
      const q = query(collection(db, "inquirySubject"));
      const querySnapshot = await getDocs(q);
      const subjectsList = querySnapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }));
      setSubjects(subjectsList);
    } catch (error) {
      console.error("Error managing subject: ", error);
      setNotification({ message: 'שגיאה בניהול הנושא. נסה שוב.', type: 'error' });
    } finally {
      setLoading(false); // Stop loading
    }
  };

  if (loading) {
    return (
      <div className="spinner-container">
        <div className="spinner"></div>
      </div>
    );
  }

  return (
    <div className="admin-inquiry-system">
      <div className="admin-inquiry-list">
        <h2>רשימת פניות</h2>
        <div className="subject-card-container">
          {subjects.map((subject) => (
            <div
              key={subject.id}
              className={`subject-card ${selectedSubject && selectedSubject.id === subject.id ? 'selected' : ''}`}
              onClick={() => fetchInquiries(subject)}
            >
              <h3>{subject.name}</h3>
            </div>
          ))}
        </div>
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
                            <p><strong>תגובה:</strong></p>
                            <div className="response-box">
                              <ReactQuill
                                value={selectedInquiry.response}
                                readOnly={true}
                                theme="bubble"
                                modules={modules}
                                className="rtl-quill"
                              />
                            </div>
                            <p><strong>תאריך תגובה:</strong> {new Date(selectedInquiry.responseDate).toLocaleString()}</p> {/* Display response date */}
                          </>
                        ) : (
                          <form onSubmit={handleResponseSubmit}>
                            <div className="admin-inquiry-list quill-container">
                              <label>כתיבת תגובה:</label>
                              <ReactQuill
                                value={response}
                                onChange={setResponse}
                                required
                                modules={{
                                  toolbar: [
                                    ['bold', 'italic', 'underline', 'link'],
                                    [{header: '1'}]
                                  ],
                                }}
                                className="rtl-quill"
                              />
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
        <div className="admin-inquiry-modal">
          <div className="admin-inquiry-form">
            <h2>ניהול נושאים</h2>
            <hr className="admin-inquiry-underline"/>
            <div className="admin-inquiry-options">
              <label>
                <input
                  type="radio"
                  value="add"
                  checked={subjectAction === "add"}
                  onChange={() => {
                    setSubjectAction("add");
                    setEditSubject(null);  // Reset selected subject when changing to add
                  }}
                />
                הוספת נושא
              </label>
              <label>
                <input
                  type="radio"
                  value="edit"
                  checked={subjectAction === "edit"}
                  onChange={() => {
                    setSubjectAction("edit");
                    setEditSubject(null);  // Reset selected subject when changing to edit
                  }}
                />
                עריכת נושא
              </label>
              <label>
                <input
                  type="radio"
                  value="remove"
                  checked={subjectAction === "remove"}
                  onChange={() => {
                    setSubjectAction("remove");
                    setEditSubject(null);  // Reset selected subject when changing to remove
                  }}
                />
                הסרת נושא
              </label>
            </div>
            {subjectAction && (
              <>
                {(subjectAction === "edit" || subjectAction === "remove") && (
                  <div className="admin-inquiry-selection">
                    <label>בחר נושא:</label>
                    <select
                      value={editSubject ? editSubject.id : ""}
                      onChange={(e) => setEditSubject(subjects.find((subject) => subject.id === e.target.value))}
                      className="admin-inquiry-input"
                    >
                      <option value="" disabled>בחר נושא</option>
                      {subjects.map((subject) => (
                        <option key={subject.id} value={subject.id}>{subject.name}</option>
                      ))}
                    </select>
                  </div>
                )}
                {(subjectAction === "add" || (subjectAction === "edit" && editSubject)) && (
                  <div className="admin-inquiry-name-input">
                    <label>שם נושא:</label>
                    <input
                      type="text"
                      placeholder="שם נושא"
                      value={newSubject}
                      onChange={(e) => setNewSubject(e.target.value)}
                      className="admin-inquiry-input"
                    />
                  </div>
                )}
                {errorMessage && <p className="error-message">{errorMessage}</p>}
                <div className="admin-inquiry-buttons">
                  <button className="admin-inquiry-submit-button" onClick={handleSubjectManagement}>שמור</button>
                  <button className="admin-inquiry-cancel-button" onClick={() => setShowSubjectModal(false)}>סגור</button>
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