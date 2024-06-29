import React, { useState, useEffect } from "react";
import { db } from "../../fireBase/firebase";
import { addDoc, collection, getDocs, query, where } from "firebase/firestore";
import { useAuth } from "../../fireBase/AuthContext";
import "../../styles/InquiryForm.css";
import brainAndFamily from '../../assets/brain_and_family.jpg'; // Import the image

const InquiryForm = () => {
  const { currentUser } = useAuth();
  const [view, setView] = useState(null);
  const [subject, setSubject] = useState("");
  const [content, setContent] = useState("");
  const [myInquiries, setMyInquiries] = useState([]);
  const [subjects, setSubjects] = useState([]);

  useEffect(() => {
    if (currentUser) {
      fetchSubjects();
    }
  }, [currentUser]);

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
      });
      setSubject("");
      setContent("");
      alert("Inquiry submitted successfully!");
      setView(null); // Reset to show the two cubes again
    } catch (error) {
      console.error("Error submitting inquiry: ", error);
      alert("Error submitting inquiry. Please try again.");
    }
  };

  const fetchMyInquiries = async () => {
    try {
      const q = query(collection(db, "inquiry"), where("email", "==", currentUser.email));
      const querySnapshot = await getDocs(q);
      setMyInquiries(querySnapshot.docs.map((doc) => ({ ...doc.data(), id: doc.id })));
      setView("myInquiries");
    } catch (error) {
      console.error("Error fetching inquiries: ", error);
      setMyInquiries([]);
      setView("myInquiries");
    }
  };

  if (!currentUser) {
    return <div>Loading...</div>;
  }

  return (
    <div className="inquiry-container">
      {view === null && (
        <div className="selection-cubes">
          <div className="cube" onClick={() => setView("newInquiry")}>
            פנייה חדשה
          </div>
          <div className="cube" onClick={fetchMyInquiries}>
            הפניות שלי
          </div>
        </div>
      )}
      {(view === "newInquiry" || view === "myInquiries") && (
        <button className="back-button" onClick={() => setView(null)}>חזור</button>
      )}
      {view === "newInquiry" && (
        <div className="inquiry-form">
          <h2>הגשת פנייה</h2>
          <form onSubmit={handleSubmit}>
            <div>
              <label className="label1">:נושא</label>
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
              <label className="label1">:תוכן הפנייה</label>
              <textarea
                className="input1"
                value={content}
                onChange={(e) => setContent(e.target.value)}
                required
                placeholder="אנא כתוב את תוכן הפנייה כאן"
              ></textarea>
            </div>
            <button type="submit">הגשת פנייה</button>
          </form>
        </div>
      )}
      {view === "myInquiries" && (
        <div className="my-inquiries">
          <h2>הפניות שלי</h2>
          {myInquiries.length > 0 ? (
            myInquiries.map((inquiry) => (
              <div key={inquiry.id} className="inquiry-item">
                <p><strong>נושא:</strong> {inquiry.subject}</p>
                <p><strong>תוכן הפנייה:</strong> {inquiry.content}</p>
                <p>
                  <strong>תגובה:</strong> {inquiry.response ? inquiry.response : "אין תגובה כרגע במערכת"}
                </p>
              </div>
            ))
          ) : (
            <p>.לא נמצאו פניות</p>
          )}
        </div>
      )}
      <img src={brainAndFamily} alt="Brain and Family" className="brain-and-family-image" />
    </div>
  );
};

export default InquiryForm;
