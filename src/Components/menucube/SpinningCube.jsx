import React from 'react';
import './SpinningCube.css'; // Import the CSS file for styling

const SpinningCube = () => {
  return (
    <div className="spinning-cube-container">
      <div className="cube">
        <div className="face front">Front</div>
        <div className="face back">Back</div>
        <div className="face left">Left</div>
        <div className="face right">Right</div>
        <div className="face top">Top</div>
        <div className="face bottom">Bottom</div>
      </div>
    </div>
  );
};

export default SpinningCube;
