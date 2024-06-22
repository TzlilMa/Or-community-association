// src/components/BulletinBoard.js
import React from 'react';
import '../styles/BulletinBoard.css';

const BulletinBoard = () => {
  return (
    <div className="bulletin-board">
      <div className="ads">
        <ul>
          <li>הודעה 1</li>
          <li>הודעה 2</li>
          <li>הודעה 3</li>
          <li>הודעה 4 </li>
          <li>הודעה 5</li>
          <li>הודעה 6</li>
          <li>הודעה 7</li>
        </ul>
      </div>
    </div>
  );
};

export default BulletinBoard;
