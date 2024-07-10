import React, { useState, useEffect, useRef } from "react";
import "../../styles/CardGrid.css"; // Importing CSS for styling
import { db, collection, query, where, getDocs } from "../../fireBase/firebase"; // Firebase imports
import DOMPurify from "dompurify"; // Sanitizing HTML content

const CardGrid = () => {
  const [expandedCardIndex, setExpandedCardIndex] = useState(null); // State to track the expanded card
  const [cards, setCards] = useState([]); // State to store the card data
  const expandedCardRef = useRef(null); // Reference to the expanded card

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
      setCards(cardData); // Setting the fetched card data to state
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
              <p>הסיפור של</p>
              <h3>{card.name}</h3>
              {expandedCardIndex !== index && (
                <button onClick={() => setExpandedCardIndex(index)}>
                  Read More
                </button>
              )}
            </div>
            {expandedCardIndex === index && (
              <div className="card-full-view">
                <div
                  className="story-text"
                  dangerouslySetInnerHTML={{
                    __html: DOMPurify.sanitize(card.story),
                  }}
                />
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
