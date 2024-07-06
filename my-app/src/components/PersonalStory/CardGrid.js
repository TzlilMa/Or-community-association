import React, { useState, useEffect, useRef } from "react";
import "../../styles/CardGrid.css"; // Adjusted to correct the path
import { db, collection, query, where, getDocs } from "../../fireBase/firebase"; // Updated path

const CardGrid = () => {
  const [expandedCardIndex, setExpandedCardIndex] = useState(null);
  const [cards, setCards] = useState([]);
  const expandedCardRef = useRef(null);

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

  useEffect(() => {
    if (expandedCardRef.current) {
      expandedCardRef.current.scrollIntoView({
        behavior: "smooth",
        block: "center",
      });
    }
  }, [expandedCardIndex]);

  return (
    <div className="card-grid-container">
      <div className="card-grid">
        {cards.map((card, index) => (
          <div
            className={`card ${expandedCardIndex === index ? "expanded" : ""}`}
            key={card.id}
            ref={expandedCardIndex === index ? expandedCardRef : null}
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
                <p className="story-text">{card.story}</p>
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
