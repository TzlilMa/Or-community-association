import React, { useState, useEffect, useRef } from "react";
import { useLocation } from "react-router-dom";
import { collection, getDocs, query, where } from "firebase/firestore"; // Import Firestore functions
import "../../styles/CardGrid.css";
import { db } from "../../fireBase/firebase"; // Import your Firebase config
import StoryCard from "./StoryCard";
import DOMPurify from "dompurify";

const useQuery = () => {
  return new URLSearchParams(useLocation().search);
};

const CardGrid = () => {
  const [expandedCardIndex, setExpandedCardIndex] = useState(null);
  const [cards, setCards] = useState([]);
  const expandedCardRef = useRef(null);
  const queryParam = useQuery();
  const storyId = queryParam.get("id");

  useEffect(() => {
    const fetchData = async () => {
      const q = query(collection(db, "users"), where("isStoryPublic", "==", true));
      const querySnapshot = await getDocs(q);
      const cardData = querySnapshot.docs.map((doc) => ({
        id: doc.id,
        userId: doc.data().userId,
        name: `${doc.data().firstName} ${doc.data().lastName}`,
        story: doc.data().personalStory,
      }));
      setCards(cardData);

      // Expand the story if id is present in the query
      if (storyId) {
        const index = cardData.findIndex((card) => card.userId === storyId);
        if (index !== -1) {
          setExpandedCardIndex(index);
        }
      }
    };

    fetchData();
  }, [storyId]);

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
          <StoryCard key={card.userId} card={card} onClick={() => setExpandedCardIndex(index)} />
        ))}
      </div>
      {expandedCardIndex !== null && (
        <div className="expanded-card-container">
          <div className="expanded-card" ref={expandedCardRef}>
            <h2 className="expanded-card-title">הסיפור של {cards[expandedCardIndex].name}</h2>
            <div className="expanded-card-full-view">
              <div
                className="expanded-story-text"
                dangerouslySetInnerHTML={{
                  __html: DOMPurify.sanitize(cards[expandedCardIndex].story),
                }}
              />
              <button onClick={() => setExpandedCardIndex(null)}>Close</button>
            </div>
          </div>
          <div className="expanded-backdrop" onClick={() => setExpandedCardIndex(null)}></div>
        </div>
      )}
    </div>
  );
};

export default CardGrid;
