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
  const [errorMessage, setErrorMessage] = useState("");

  useEffect(() => {
    const fetchData = async () => {
      const textsCollection = collection(db, "managerWords");
      const snapshot = await getDocs(textsCollection);
      const data = snapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
        date: doc.data().date.toDate(), // Convert Firestore timestamp to JS Date
      }));
      data.sort((a, b) => new Date(b.date) - new Date(a.date)); // Sort by date descending
      setTexts(data);
    };

    fetchData();
  }, []);

  const formatDateString = (date) => {
    const options = { year: "numeric", month: "long", day: "numeric", hour: "2-digit", minute: "2-digit" };
    return new Date(date).toLocaleDateString("he-IL", options).replace(":00", ""); // Format date without seconds
  };

  const handleAddText = async () => {
    if (!newText.trim()) {
      setErrorMessage("אנא מלא את תוכן הטקסט");
      return;
    }

    const textsCollection = collection(db, "managerWords");
    await addDoc(textsCollection, {
      text: newText,
      date: new Date(), // Save the current date as a timestamp
    });
    setNewText("");
    const snapshot = await getDocs(textsCollection);
    const data = snapshot.docs.map((doc) => ({
      id: doc.id,
      ...doc.data(),
      date: doc.data().date.toDate(), // Convert Firestore timestamp to JS Date
    }));
    data.sort((a, b) => new Date(b.date) - new Date(a.date)); // Sort by date descending
    setTexts(data);
    setShowModal(false);
  };

  const handleEditText = async () => {
    if (!selectedDate) {
      setErrorMessage("אנא בחר תאריך");
      return;
    }

    if (!editText.trim()) {
      setErrorMessage("אנא מלא את תוכן הטקסט");
      return;
    }

    const textDoc = doc(db, "managerWords", editTextId);
    await updateDoc(textDoc, { text: editText });
    const textsCollection = collection(db, "managerWords");
    const snapshot = await getDocs(textsCollection);
    const data = snapshot.docs.map((doc) => ({
      id: doc.id,
      ...doc.data(),
      date: doc.data().date.toDate(), // Convert Firestore timestamp to JS Date
    }));
    data.sort((a, b) => new Date(b.date) - new Date(a.date)); // Sort by date descending
    setTexts(data);
    setEditText("");
    setEditTextId(null);
    setShowModal(false);
  };

  const handleDeleteText = async () => {
    if (!selectedDate) {
      setErrorMessage("אנא בחר תאריך");
      return;
    }

    const textDoc = doc(db, "managerWords", editTextId);
    await deleteDoc(textDoc);
    const textsCollection = collection(db, "managerWords");
    const snapshot = await getDocs(textsCollection);
    const data = snapshot.docs.map((doc) => ({
      id: doc.id,
      ...doc.data(),
      date: doc.data().date.toDate(), // Convert Firestore timestamp to JS Date
    }));
    data.sort((a, b) => new Date(b.date) - new Date(a.date)); // Sort by date descending
    setTexts(data);
    setEditTextId(null);
    setShowModal(false);
  };

  const handleOpenModal = (action = "add") => {
    setAction(action);
    setShowModal(true);
    setErrorMessage("");
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
    const textItem = texts.find((text) => new Date(text.date).toISOString() === date);
    setEditTextId(textItem.id);
    setEditText(textItem.text);
  };

  const handleChangeAction = (newAction) => {
    setAction(newAction);
    setErrorMessage("");
    setEditText("");
    setSelectedDate("");
    setNewText("");
  };

  return (
    <div className="management-container">
      <h1>דבר מנהל</h1>
      <div className="text-cards-container">
        {texts.map((textItem) => (
          <div key={textItem.id} className="text-card">
            <p className="date-line">עדכון מתאריך: {formatDateString(textItem.date)}</p>
            <p>{textItem.text}</p>
            {isAdmin && (
              <button className="management-manage-button" onClick={() => handleOpenModal("edit")}>
                ניהול
              </button>
            )}
          </div>
        ))}
        {texts.length === 0 && isAdmin && (
          <button className="management-manage-button" onClick={() => handleOpenModal("add")}>
            ניהול
          </button>
        )}
      </div>
      {showModal && (
        <>
          <div className="management-dark-background"></div>
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
                    onChange={() => handleChangeAction("add")}
                  />
                  הוספת טקסט
                </label>
                <label>
                  <input
                    type="radio"
                    value="edit"
                    checked={action === "edit"}
                    onChange={() => handleChangeAction("edit")}
                  />
                  עריכת טקסט
                </label>
                <label>
                  <input
                    type="radio"
                    value="delete"
                    checked={action === "delete"}
                    onChange={() => handleChangeAction("delete")}
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
                </div>
              )}
              {action === "edit" && (
                <>
                  <div className="management-selection">
                    <select value={selectedDate} onChange={handleSelectDate} className="management-input">
                      <option value="" disabled>
                        בחר תאריך
                      </option>
                      {texts.map((textItem) => (
                        <option key={textItem.id} value={new Date(textItem.date).toISOString()}>
                          {formatDateString(textItem.date)}
                        </option>
                      ))}
                    </select>
                  </div>
                  <div className="management-textbox">
                    <textarea
                      value={editText}
                      onChange={(e) => setEditText(e.target.value)}
                      placeholder="ערוך את הטקסט..."
                      className="management-input"
                    ></textarea>
                  </div>
                </>
              )}
              {action === "delete" && (
                <div className="management-selection">
                  <label>בחר תאריך:</label>
                  <select value={selectedDate} onChange={handleSelectDate} className="management-input">
                    <option value="" disabled>
                      בחר תאריך
                    </option>
                    {texts.map((textItem) => (
                      <option key={textItem.id} value={new Date(textItem.date).toISOString()}>
                        {formatDateString(textItem.date)}
                      </option>
                    ))}
                  </select>
                </div>
              )}
              {errorMessage && <p className="error-message">{errorMessage}</p>}
              <div className="management-buttons">
                {action === "add" && (
                  <button onClick={handleAddText} className="management-submit-button">
                    שמור
                  </button>
                )}
                {action === "edit" && (
                  <button onClick={handleEditText} className="management-submit-button">
                    שמור
                  </button>
                )}
                {action === "delete" && (
                  <button onClick={handleDeleteText} className="management-submit-button">
                    מחק
                  </button>
                )}
                <button className="management-cancel-button" onClick={() => setShowModal(false)}>
                  סגור
                </button>
              </div>
            </div>
          </div>
        </>
      )}
    </div>
  );
};

export default Management;
