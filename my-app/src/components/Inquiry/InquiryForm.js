import React, { useState, useEffect, useCallback } from "react";
import { db } from "../../fireBase/firebase";
import { addDoc, collection, getDocs, query, where } from "firebase/firestore";
import { useAuth } from "../../fireBase/AuthContext";
import "../../styles/InquiryForm.css";
import Notification from '../General/Notification';
import brainAndFamily from '../../assets/brain_and_family.jpg'; // Import the image

const InquiryForm = () => {
  const { currentUser } = useAuth();
  const [view, setView] = useState(null);
  const [subject, setSubject] = useState("");
  const [content, setContent] = useState("");
  const [myInquiries, setMyInquiries] = useState([]);
  const [subjects, setSubjects] = useState([]);
  const [notification, setNotification] = useState({ message: '', type: '' });

  const fetchMyInquiries = useCallback(async () => {
    try {
      const q = query(collection(db, "inquiry"), where("email", "==", currentUser.email));
      const querySnapshot = await getDocs(q);
      setMyInquiries(querySnapshot.docs.map((doc) => ({ ...doc.data(), id: doc.id })));
    } catch (error) {
      console.error("Error fetching inquiries: ", error);
      setMyInquiries([]);
    }
  }, [currentUser]);

  useEffect(() => {
    if (currentUser) {
      fetchSubjects();
      fetchMyInquiries();
    }
  }, [currentUser, fetchMyInquiries]);

  const fetchSubjects = async () => {
    try {
      const q = query(collection(db, "inquirySubject"));
      const querySnapshot = await getDocs(q);
      setSubjects(querySnapshot.docs.map((doc) => doc.data().name));
    } catch (error) {
      console.error("Error fetching subjects: ", error);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await addDoc(collection(db, "inquiry"), {
        email: currentUser.email,
        subject: subject,
        content: content,
        response: "",
        submitDate: new Date().toISOString(), // Add submit date
      });
      setSubject("");
      setContent("");
      setNotification({ message: 'פנייתך הוגשה בהצלחה!', type: 'success' });
      fetchMyInquiries(); // Fetch inquiries again after submitting
      setView(null); // Reset to show the inquiries again
    } catch (error) {
      console.error("Error submitting inquiry: ", error);
      setNotification({ message: 'הגשת הפנייה נכשלה, אנא נסה שוב', type: 'error' });
    }
  };

  const handleNewInquiryClick = () => {
    setView("newInquiry");
  };

  const formatDate = (dateString) => {
    const options = { year: 'numeric', month: '2-digit', day: '2-digit', hour: '2-digit', minute: '2-digit' };
    return new Date(dateString).toLocaleDateString('he-IL', options);
  };

  if (!currentUser) {
    return <div>Loading...</div>;
  }

  return (
    <div className="inquiry-page">
      <div className="inquiry-right">
        <div className="my-inquiries">
          <h2>הפניות שלי</h2>
          {myInquiries.length > 0 ? (
            myInquiries.map((inquiry) => (
              <div key={inquiry.id} className="inquiry-item">
                <p><strong>תאריך הגשה:</strong> {formatDate(inquiry.submitDate)}</p> {/* Format date without seconds */}
                <p><strong>נושא:</strong> {inquiry.subject}</p>
                <p><strong>תוכן הפנייה:</strong> {inquiry.content}</p>
                <p>
                  {inquiry.responseDate && <p><strong>תאריך תגובה:</strong> {formatDate(inquiry.responseDate)}</p>} {/* Format date without seconds */}
                  <strong>{inquiry.response ? "תגובה:" : "אין תגובה כרגע במערכת"}</strong> {inquiry.response}
                </p>
              </div>
            ))
          ) : (
            <p>.לא נמצאו פניות</p>
          )}
        </div>
      </div>
      <div className="inquiry-left">
        <button className="button new-inquiry-button" onClick={handleNewInquiryClick}>
          פנייה חדשה
        </button>
        <img src={brainAndFamily} alt="Brain and Family" className="brain-and-family-image" />
      </div>
      {view === "newInquiry" && (
        <div className="inquiry-form-modal">
          <div className="inquiry-form">
            <h2>הוספת פנייה חדשה</h2>
            <hr className="inquiry-form-underline"/>
            <form onSubmit={handleSubmit}>
              <div>
                <label className="label1">נושא:</label>
                <select
                  className="input1"
                  value={subject}
                  onChange={(e) => setSubject(e.target.value)}
                  required
                >
                  <option value="" disabled>בחר נושא</option>
                  {subjects.map((subj, index) => (
                    <option key={index} value={subj}>{subj}</option>
                  ))}
                </select>
              </div>
              <div>
                <label className="label1">תוכן הפנייה:</label>
                <textarea
                  className="input1"
                  value={content}
                  onChange={(e) => setContent(e.target.value)}
                  required
                  placeholder="אנא כתוב את תוכן הפנייה כאן"
                ></textarea>
              </div>
                <button type="submit" className="inqury-submit-button">הוספה</button>
                <button type="button" className="inqury-cancel-button" onClick={() => setView(null)}>ביטול</button>
            </form>
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

export default InquiryForm;
