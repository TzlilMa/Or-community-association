import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import StoryCard from "../components/PersonalStory/StoryCard";
import "../styles/StoryCarousel.css";

const StoryCarousel = ({ stories }) => {
  const [visibleStories, setVisibleStories] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    const updateVisibleStories = () => {
      if (stories.length <= 4) {
        setVisibleStories(stories);
      } else {
        const shuffledStories = [...stories].sort(() => 0.5 - Math.random());
        setVisibleStories(shuffledStories.slice(0, 4));
      }
    };

    updateVisibleStories();
    const interval = setInterval(updateVisibleStories, 10000); // Update every 10 seconds

    return () => clearInterval(interval);
  }, [stories]);

  const handleStoryClick = (userId) => {
    navigate(`/stories?id=${userId}`);
  };

  return (
    <div className="story-carousel">
      {visibleStories.map((story, index) => (
        <div key={story.userId} className="carousel-story-card-wrapper">
          <StoryCard card={story} onClick={() => handleStoryClick(story.userId)} />
        </div>
      ))}
    </div>
  );
};

export default StoryCarousel;
