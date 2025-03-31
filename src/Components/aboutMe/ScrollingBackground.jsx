import React, { useState, useEffect } from 'react';
import './ScrollingBackground.css'; // Import the CSS file

const ScrollingBackground = () => {
  const [scrollPosition, setScrollPosition] = useState(0);

  const handleScroll = () => {
    const position = window.pageYOffset;
    setScrollPosition(position);
  };

  useEffect(() => {
    window.addEventListener('scroll', handleScroll);
    return () => {
      window.removeEventListener('scroll', handleScroll);
    };
  }, []);

  return (
    <div className="scrolling-background" style={{ backgroundPositionY: scrollPosition * 0.5 }}>
      <div className={`background-layer ${scrollPosition > 300 ? 'second' : 'first'}`}>
        <p>Scroll down to see the background change!</p>
      </div>
    </div>
  );
};

export default ScrollingBackground;
