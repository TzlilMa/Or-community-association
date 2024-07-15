import React, { useState, useEffect } from "react";
import {
  db,
  collection,
  getDocs,
  addDoc,
  updateDoc,
  deleteDoc,
  doc,
} from "../../fireBase/firebase";
import { useAuth } from "../../fireBase/AuthContext";
import "../../styles/Management.css";

const Management = ({ isAdmin }) => {
  const [texts, setTexts] = useState([]);
  const [newText, setNewText] = useState("");
  const [editText, setEditText] = useState("");
  const [editTextId, setEditTextId] = useState(null);
  const [selectedDate, setSelectedDate] = useState("");
  const [showModal, setShowModal] = useState(false);
  const [action, setAction] = useState("add");

  useEffect(() => {
    const fetchData = async () => {
      const textsCollection = collection(db, "managerWords");
      const snapshot = await getDocs(textsCollection);
      const data = snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }));
      data.sort((a, b) => new Date(b.date) - new Date(a.date)); // Sort by date descending
      setTexts(data);
    };

    fetchData();
  }, []);

  const handleAddText = async () => {
    if (!newText.trim()) {
      alert("אנא מלא את תוכן הטקסט");
      return;
    }

    const textsCollection = collection(db, "managerWords");
    await addDoc(textsCollection, { text: newText, date: new Date().toISOString() });
    setNewText("");
    const snapshot = await getDocs(textsCollection);
    const data = snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }));
    data.sort((a, b) => new Date(b.date) - new Date(a.date)); // Sort by date descending
    setTexts(data);
    setShowModal(false);
  };

  const handleEditText = async () => {
    if (!editText.trim()) {
      alert("אנא מלא את תוכן הטקסט");
      return;
    }

    const textDoc = doc(db, "managerWords", editTextId);
    await updateDoc(textDoc, { text: editText });
    const textsCollection = collection(db, "managerWords");
    const snapshot = await getDocs(textsCollection);
    const data = snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }));
    data.sort((a, b) => new Date(b.date) - new Date(a.date)); // Sort by date descending
    setTexts(data);
    setEditText("");
    setEditTextId(null);
    setShowModal(false);
  };

  const handleDeleteText = async () => {
    const textDoc = doc(db, "managerWords", editTextId);
    await deleteDoc(textDoc);
    const textsCollection = collection(db, "managerWords");
    const snapshot = await getDocs(textsCollection);
    const data = snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }));
    data.sort((a, b) => new Date(b.date) - new Date(a.date)); // Sort by date descending
    setTexts(data);
    setEditTextId(null);
    setShowModal(false);
  };

  const handleOpenModal = (action) => {
    setAction(action);
    setShowModal(true);
    if (action === "add") {
      setNewText("");
    } else {
      setEditText("");
      setSelectedDate("");
    }
  };

  const handleSelectDate = (e) => {
    const date = e.target.value;
    setSelectedDate(date);
    const textItem = texts.find((text) => text.date === date);
    setEditTextId(textItem.id);
    setEditText(textItem.text);
  };

  return (
    <div className="management-container">
      <h1>דבר מנהל</h1>
      <div className="text-cards-container">
        {texts.map((textItem) => (
          <div key={textItem.id} className="text-card">
            <p className="date-line">עדכון מתאריך: {new Date(textItem.date).toLocaleDateString()}</p>
            <p>{textItem.text}</p>
            {isAdmin && (
              <button className="management-manage-button" onClick={() => handleOpenModal("edit")}>
                ניהול
              </button>
            )}
          </div>
        ))}
      </div>
      {showModal && (
        <div className="management-modal">
          <div className="management-modal-content">
            <h2>ניהול טקסט</h2>
            <hr className="management-underline" />
            <div className="management-options">
              <label>
                <input
                  type="radio"
                  value="add"
                  checked={action === "add"}
                  onChange={() => setAction("add")}
                />
                הוספת טקסט
              </label>
              <label>
                <input
                  type="radio"
                  value="edit"
                  checked={action === "edit"}
                  onChange={() => setAction("edit")}
                />
                עריכת טקסט
              </label>
              <label>
                <input
                  type="radio"
                  value="delete"
                  checked={action === "delete"}
                  onChange={() => setAction("delete")}
                />
                מחיקת טקסט
              </label>
            </div>
            {action === "add" && (
              <div className="management-textbox">
                <textarea
                  value={newText}
                  onChange={(e) => setNewText(e.target.value)}
                  placeholder="הוסף טקסט חדש..."
                  className="management-input"
                ></textarea>
                <div className="management-buttons">
                  <button onClick={handleAddText} className="management-submit-button">
                    שמור
                  </button>
                  <button className="management-cancel-button" onClick={() => setShowModal(false)}>
                    סגור
                  </button>
                </div>
              </div>
            )}
            {(action === "edit" || action === "delete") && (
              <>
                <div className="management-selection">
                  <label>בחר תאריך:</label>
                  <select value={selectedDate} onChange={handleSelectDate} className="management-input">
                    <option value="" disabled>
                      בחר תאריך
                    </option>
                    {texts.map((textItem) => (
                      <option key={textItem.id} value={textItem.date}>
                        {new Date(textItem.date).toLocaleDateString()}
                      </option>
                    ))}
                  </select>
                </div>
                <div className="management-buttons">
                  <button
                    onClick={action === "edit" ? handleEditText : handleDeleteText}
                    className="management-submit-button"
                  >
                    {action === "edit" ? "שמור" : "מחק"}
                  </button>
                  <button className="management-cancel-button" onClick={() => setShowModal(false)}>
                    סגור
                  </button>
                </div>
              </>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default Management;
