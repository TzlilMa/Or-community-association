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
        <textarea
          value={newText}
          onChange={(e) => setNewText(e.target.value)}
          rows="10"
        />
        <div className="modal-actions">
          <button onClick={handleSave}>Save</button>
          <button onClick={onClose}>Close</button>
        </div>
      </div>
    </div>
  );
};

export default EditModal;
