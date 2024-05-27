import React, { useEffect, useState } from 'react';
import '../styles/TextMarquee.css'; // Import the CSS file for styling the marquee

const TextMarquee = ({ text }) => {
  const [offset, setOffset] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setOffset((prevOffset) => (prevOffset + 1) % 100);
    }, 50); // Adjust the speed as needed

    return () => clearInterval(interval); // Clean up the interval on component unmount
  }, []);

  return (
    <div className="marquee-container">
      <div className="marquee" style={{ transform: `translateY(${offset}%)` }}>
        {text.split('\n').map((line, index) => (
          <div key={index}>{line}</div>
        ))}
      </div>
    </div>
  );
};

export default TextMarquee;
