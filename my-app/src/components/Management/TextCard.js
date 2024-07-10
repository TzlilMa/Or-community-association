import React from "react";
import "../../styles/TextCard.css";

const TextCard = ({ text, onEdit, onDelete }) => {
  return (
    <div className="text-card">
      <p>{text}</p>
      <div className="text-card-buttons">
        <button onClick={onEdit}>Edit</button>
        <button onClick={onDelete} className="delete-button">
          Delete
        </button>
      </div>
    </div>
  );
};

export default TextCard;
