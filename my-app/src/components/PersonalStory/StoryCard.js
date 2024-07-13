import React from "react";
import "../../styles/storyCard.css"; // Ensure this import is correct

const StoryCard = ({ card, onClick }) => {
  return (
    <div className="story-card" onClick={onClick}>
      <div className="story-card-content">
        <p>הסיפור של</p>
        <h3>{card.name}</h3>
        <button>Read More</button>
      </div>
    </div>
  );
};

export default StoryCard;
