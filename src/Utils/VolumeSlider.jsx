import React, { useContext } from 'react';
import { SoundContext } from './SoundProvider';
import './VolumeSlider.css'; // Import the CSS file

const VolumeSlider = () => {
  const { volume, setVolume } = useContext(SoundContext);

  const handleVolumeChange = (event) => {
    const newVolume = event.target.value / 100; // Convert slider value to a 0-1 range
    setVolume(newVolume);
  };

  return (
    <div className="volume-slider">
      <input
        type="range"
        min="0"
        max="100"
        value={volume * 100} // Convert volume to a percentage for the slider
        onChange={handleVolumeChange} // Update volume on slider change
        className="slider"
      />
      {/* Render the audio visualizer if audioStream is available */}
      {/* {audioStream && (
        <LiveAudioVisualizer
          audioStream={audioStream} // Pass audioStream to the visualizer
          width={200}
          height={75}
        />
      )} */}
    </div>
  );
};

export default VolumeSlider;
