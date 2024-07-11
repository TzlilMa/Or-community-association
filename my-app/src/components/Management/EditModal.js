import React, { useState } from "react";
import "../../styles/EditModal.css";

const EditModal = ({ text, onSave, onClose }) => {
  const [newText, setNewText] = useState(text);

  const handleSave = () => {
    onSave(newText);
  };

  return (
    <div className="modal">
      <div className="modal-content">
        <h2>Edit Text</h2>
        <textarea
          value={newText}
          onChange={(e) => setNewText(e.target.value)}
          rows="10"
        />
        <div className="modal-actions">
          <button className="close-button" onClick={onClose}>
            Close
          </button>
          <button className="save-button" onClick={handleSave}>
            Save
          </button>
        </div>
      </div>
    </div>
  );
};

export default EditModal;
