import React, { useState, useEffect } from "react";
import "../../styles/Management.css";
import {
  db,
  collection,
  getDocs,
  addDoc,
  updateDoc,
  deleteDoc,
  doc,
} from "../../fireBase/firebase";
import TextCard from "./TextCard";
import EditModal from "./EditModal";

const Management = ({ isAdmin }) => {
  const [texts, setTexts] = useState([]);
  const [newText, setNewText] = useState("");
  const [editText, setEditText] = useState(null);
  const [editTextId, setEditTextId] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      const textsCollection = collection(db, "managerWords");
      const snapshot = await getDocs(textsCollection);
      const data = snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }));
      setTexts(data);
    };

    fetchData();
  }, []);

  const handleAddText = async () => {
    if (newText.trim()) {
      const textsCollection = collection(db, "managerWords");
      await addDoc(textsCollection, { text: newText });
      setNewText("");
      const snapshot = await getDocs(textsCollection);
      const data = snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }));
      setTexts(data);
    }
  };

  const handleEditText = (id, text) => {
    setEditText(text);
    setEditTextId(id);
  };

  const handleSaveEdit = async (newText) => {
    const textDoc = doc(db, "managerWords", editTextId);
    await updateDoc(textDoc, { text: newText });
    const textsCollection = collection(db, "managerWords");
    const snapshot = await getDocs(textsCollection);
    const data = snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }));
    setTexts(data);
    setEditText(null);
    setEditTextId(null);
  };

  const handleDeleteText = async (id) => {
    const textDoc = doc(db, "managerWords", id);
    await deleteDoc(textDoc);
    const textsCollection = collection(db, "managerWords");
    const snapshot = await getDocs(textsCollection);
    const data = snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }));
    setTexts(data);
  };

  return (
    <div className="management-container">
      <h1>דבר מנהל</h1>
      <div className="text-cards-container">
        {texts.map((textItem) => (
          <TextCard
            key={textItem.id}
            text={textItem.text}
            onEdit={() => handleEditText(textItem.id, textItem.text)}
            onDelete={() => handleDeleteText(textItem.id)}
          />
        ))}
      </div>
      {isAdmin && (
        <div className="add-text">
          <textarea
            value={newText}
            onChange={(e) => setNewText(e.target.value)}
            placeholder="Add new text..."
          ></textarea>
          <button onClick={handleAddText}>Add Text</button>
        </div>
      )}
      {editText && (
        <EditModal
          text={editText}
          onSave={handleSaveEdit}
          onClose={() => setEditText(null)}
        />
      )}
    </div>
  );
};

export default Management;
