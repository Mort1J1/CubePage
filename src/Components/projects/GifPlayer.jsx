import React, { useState, useEffect } from 'react';
import './GifPlayer.css';


const GifPlayer = ({ src, pausedSrc, alt = 'GIF' }) => {
  const [isPlaying, setIsPlaying] = useState(true);

  const togglePlayPause = () => {
    setIsPlaying(!isPlaying);
  };

  useEffect(() => {
    // Set a timer to pause the GIF after 5 seconds
    const timer = setTimeout(() => {
      setIsPlaying(false);
    }, 3900); // 5 seconds

    // Clean up the timer if the component unmounts
    return () => clearTimeout(timer);
  }, [isPlaying]); // Empty dependency array ensures this effect runs only on mount



  return (
    <div className="gif-player">
      <img
        onClick={togglePlayPause}
        src={isPlaying ? src : pausedSrc}
        alt={alt}
        className="gif-image"
      />
      {/* <button onClick={togglePlayPause} className="play-pause-button">
        {isPlaying ? 'Pause' : 'Play'}
      </button> */}
    </div>
  );
};

export default GifPlayer;
