import React, { useState, useEffect, useRef } from "react";
import { useLocation } from "react-router-dom";
import { collection, getDocs, query, where } from "firebase/firestore";
import { db } from "../../fireBase/firebase";
import StoryCard from "./StoryCard";
import DOMPurify from "dompurify";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faPlus, faMinus } from '@fortawesome/free-solid-svg-icons';
import "../../styles/CardGrid.css";

const useQuery = () => {
  return new URLSearchParams(useLocation().search);
};

const CardGrid = () => {
  const [expandedCardIndex, setExpandedCardIndex] = useState(null);
  const [cards, setCards] = useState([]);
  const [fontSize, setFontSize] = useState(16);
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

  const increaseFontSize = () => {
    setFontSize((prevSize) => Math.min(prevSize + 2, 24));
  };

  const decreaseFontSize = () => {
    setFontSize((prevSize) => Math.max(prevSize - 2, 12));
  };

  return (
    <div className="card-grid-container">
      <div className="card-grid">
        {cards.map((card, index) => (
          <StoryCard key={card.userId} card={card} onClick={() => setExpandedCardIndex(index)} />
        ))}
      </div>
      {expandedCardIndex !== null && (
        <div className="expanded-card-container">
          <div className="expanded-backdrop" onClick={() => setExpandedCardIndex(null)}></div>
          <div className="expanded-card" ref={expandedCardRef}>
            <h2 className="expanded-card-title">הסיפור של {cards[expandedCardIndex].name}</h2>
            <div className="font-size-controls">
              <button onClick={decreaseFontSize}><FontAwesomeIcon icon={faMinus} /></button>
              <button onClick={increaseFontSize}><FontAwesomeIcon icon={faPlus} /></button>
            </div>
            <div className="expanded-card-full-view">
              <div
                className="expanded-story-text"
                style={{ fontSize: `${fontSize}px` }}
                dangerouslySetInnerHTML={{
                  __html: DOMPurify.sanitize(cards[expandedCardIndex].story),
                }}
              />
              <button onClick={() => setExpandedCardIndex(null)}>סגירה</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default CardGrid;