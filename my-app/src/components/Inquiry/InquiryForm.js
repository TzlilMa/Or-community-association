import React, { useState, useEffect } from "react";
import { db } from "../../fireBase/firebase";
import { addDoc, collection, getDocs, query, where } from "firebase/firestore";
import { useAuth } from "../../fireBase/AuthContext";
import AdminInquiryList from "./AdminInquiryList";
import "../../styles/InquiryForm.css";

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

  if (currentUser?.isAdmin) {
    return <AdminInquiryList />;
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
      {view === "newInquiry" && (
        <div className="inquiry-form">
          <h2>Submit an Inquiry</h2>
          <form onSubmit={handleSubmit}>
            <div>
              <label className="label1">Subject:</label>
              <select
                className="input1"
                value={subject}
                onChange={(e) => setSubject(e.target.value)}
                required
              >
                <option value="" disabled>Select a subject</option>
                {subjects.map((subj, index) => (
                  <option key={index} value={subj}>{subj}</option>
                ))}
              </select>
            </div>
            <div>
              <label className="label1">Content:</label>
              <textarea
                className="input1"
                value={content}
                onChange={(e) => setContent(e.target.value)}
                required
                placeholder="Please enter your content"
              ></textarea>
            </div>
            <button type="submit">Submit Inquiry</button>
          </form>
        </div>
      )}
      {view === "myInquiries" && (
        <div className="my-inquiries">
          <h2>My Inquiries</h2>
          {myInquiries.length > 0 ? (
            myInquiries.map((inquiry) => (
              <div key={inquiry.id} className="inquiry-item">
                <p><strong>Subject:</strong> {inquiry.subject}</p>
                <p><strong>Content:</strong> {inquiry.content}</p>
                <p>
                  <strong>Admin Response:</strong> {inquiry.response ? inquiry.response : "There is no response"}
                </p>
              </div>
            ))
          ) : (
            <p>No inquiries found.</p>
          )}
        </div>
      )}
    </div>
  );
};

export default InquiryForm;
