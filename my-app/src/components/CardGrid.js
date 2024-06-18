import React from 'react';
import '../styles/CardGrid.css';

const CardGrid = () => {
  const cards = [
    { title: "Winnie the Pooh: Blood and Honey 2", subtitle: "WEB-DL - 720p" },
    { title: "IF", subtitle: "WEB-DL - 1080p" },
    { title: "Wedding Season", subtitle: "WEB-DL - 1080p" },
    { title: "Back to Black", subtitle: "WEB-DL - 720p" },
    { title: "The Miracle Club", subtitle: "BluRay - 720p" },
    { title: "Godzilla X Kong: The New Empire", subtitle: "BluRay - 4K" },
    { title: "Hit Man", subtitle: "WEB-DL - 4K" },
    { title: "Inside Out 2", subtitle: "TS - 720p" },
    { title: "The Monk and the Gun", subtitle: "WEB-DL - 720p" },
    { title: "Kung Fu Panda 4", subtitle: "BluRay - 720p" }
  ];

  return (
    <div className="card-grid">
      {cards.map((card, index) => (
        <div className="card" key={index}>
          <div className="card-content">
            <h3>{card.title}</h3>
            <p>{card.subtitle}</p>
          </div>
          <div className="card-hover-content">
            <p>Additional information about {card.title}</p>
          </div>
        </div>
      ))}
    </div>
  );
};

export default CardGrid;
