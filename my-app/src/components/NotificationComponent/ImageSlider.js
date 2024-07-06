// src/components/ImageSlider.js
import React, { useState } from "react";

const ImageSlider = () => {
  const images = [
    {
      imgURL:
        "https://images.pexels.com/photos/461198/pexels-photo-461198.jpeg?auto=compress&cs=tinysrgb&h=750&w=1260",
      imgAlt: "img-1",
    },
    {
      imgURL:
        "https://images.pexels.com/photos/1640777/pexels-photo-1640777.jpeg?auto=compress&cs=tinysrgb&h=750&w=1260",
      imgAlt: "img-2",
    },
    {
      imgURL:
        "https://images.pexels.com/photos/1128678/pexels-photo-1128678.jpeg?auto=compress&cs=tinysrgb&h=750&w=1260",
      imgAlt: "img-3",
    },
    {
      imgURL:
        "https://images.pexels.com/photos/54455/cook-food-kitchen-eat-54455.jpeg?auto=compress&cs=tinysrgb&h=750&w=1260",
      imgAlt: "img-4",
    },
  ];

  const [currentIndex, setCurrentIndex] = useState(0);

  const handlePrevImage = () => {
    setCurrentIndex(
      (prevIndex) => (prevIndex - 1 + images.length) % images.length
    );
  };

  const handleNextImage = () => {
    setCurrentIndex((prevIndex) => (prevIndex + 1) % images.length);
  };

  return (
    <div className="image-slider">
      <button className="prev-button" onClick={handlePrevImage}>
        &#10094;
      </button>
      <img
        src={images[currentIndex].imgURL}
        alt={images[currentIndex].imgAlt}
        className="image-slider-img"
      />
      <button className="next-button" onClick={handleNextImage}>
        &#10095;
      </button>
    </div>
  );
};

export default ImageSlider;
