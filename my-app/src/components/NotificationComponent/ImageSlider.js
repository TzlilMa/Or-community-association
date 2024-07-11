// src/components/ImageSlider.js
import React, { useState } from "react";
import p1 from "../../assets/p1.jpeg";
import p2 from "../../assets/p2.jpeg";
import p3 from "../../assets/p3.jpeg";
import p4 from "../../assets/p4.jpeg";
import p5 from "../../assets/p5.jpeg";

const ImageSlider = () => {
  const images = [
    {
      imgURL: p1,
      imgAlt: "img-1",
    },
    {
      imgURL: p2,
      imgAlt: "img-2",
    },
    {
      imgURL: p3,
      imgAlt: "img-3",
    },
    {
      imgURL: p4,
      imgAlt: "img-4",
    },
    {
      imgURL: p5,
      imgAlt: "img-5",
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
