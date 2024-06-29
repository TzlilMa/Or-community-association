import React, { useState, useEffect } from "react";
import "../styles/CardGrid.css";
import { db, collection, query, where, getDocs } from "../fireBase/firebase"; // Updated path

const CardGrid = () => {
  const [expandedCardIndex, setExpandedCardIndex] = useState(null);
  const [cards, setCards] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      const q = query(
        collection(db, "users"),
        where("isStoryPublic", "==", true)
      );
      const querySnapshot = await getDocs(q);
      const cardData = querySnapshot.docs.map((doc) => ({
        id: doc.id,
        name: `${doc.data().firstName} ${doc.data().lastName}`,
        story: doc.data().personalStory,
      }));
      setCards(cardData);
    };

    fetchData();
  }, []);

  return (
    <div className="card-grid-container">
      <div className="card-grid">
        {cards.map((card, index) => (
          <div
            className={`card ${expandedCardIndex === index ? "expanded" : ""}`}
            key={card.id}
            style={{
              display:
                expandedCardIndex !== null && expandedCardIndex !== index
                  ? "none"
                  : "block",
            }}
          >
            <div className="card-content">
              <h3>{card.name}</h3>
              {expandedCardIndex !== index && (
                <button onClick={() => setExpandedCardIndex(index)}>
                  Read More
                </button>
              )}
            </div>
            {expandedCardIndex === index && (
              <div className="card-full-view">
                <p>{card.story}</p>
                <button onClick={() => setExpandedCardIndex(null)}>
                  Close
                </button>
              </div>
            )}
          </div>
        ))}
        {expandedCardIndex !== null && (
          <div
            className="backdrop"
            onClick={() => setExpandedCardIndex(null)}
          ></div>
        )}
      </div>
    </div>
  );
};

export default CardGrid;
