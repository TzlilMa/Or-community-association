import React, { useState } from "react";
import "../styles/CardGrid.css";

const CardGrid = () => {
  const [expandedCardIndex, setExpandedCardIndex] = useState(null);

  const cards = [
    {
      title: "Winnie the Pooh: Blood and Honey 2",
      subtitle: "WEB-DL - 720p",
      story: "Story content for Winnie the Pooh: Blood and Honey 2",
    },
    { title: "IF", subtitle: "WEB-DL - 1080p", story: "Story content for IF" },
    {
      title: "Wedding Season",
      subtitle: "WEB-DL - 1080p",
      story: "Story content for Wedding Season",
    },
    {
      title: "Back to Black",
      subtitle: "WEB-DL - 720p",
      story: "Story content for Back to Black",
    },
    {
      title: "The Miracle Club",
      subtitle: "BluRay - 720p",
      story: "Story content for The Miracle Club",
    },
    {
      title: "Godzilla X Kong: The New Empire",
      subtitle: "BluRay - 4K",
      story: "Story content for Godzilla X Kong: The New Empire",
    },
    {
      title: "Hit Man",
      subtitle: "WEB-DL - 4K",
      story: "Story content for Hit Man",
    },
    {
      title: "Inside Out 2",
      subtitle: "TS - 720p",
      story: "Story content for Inside Out 2",
    },
    {
      title: "The Monk and the Gun",
      subtitle: "WEB-DL - 720p",
      story: "Story content for The Monk and the Gun",
    },
    {
      title: "Kung Fu Panda 4",
      subtitle: "BluRay - 720p",
      story: "Story content for Kung Fu Panda 4",
    },
  ];

  return (
    <div className="card-grid">
      {cards.map((card, index) => (
        <div
          className={`card ${expandedCardIndex === index ? "expanded" : ""}`}
          key={index}
        >
          <div className="card-content">
            <h3>{card.title}</h3>
            <p>{card.subtitle}</p>
            <button onClick={() => setExpandedCardIndex(index)}>
              Read More
            </button>
          </div>
          {expandedCardIndex === index && (
            <div className="card-full-view">
              <p>{card.story}</p>
              <button onClick={() => setExpandedCardIndex(null)}>Close</button>
            </div>
          )}
        </div>
      ))}
    </div>
  );
};

export default CardGrid;
