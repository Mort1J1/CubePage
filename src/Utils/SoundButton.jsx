import React, { useState, useEffect } from 'react';
import { useContext } from 'react';
import VolumeSlider from './VolumeSlider'; // Import the VolumeSlider component
import './SoundButton.css'; // Import the CSS file
import { SoundContext } from './SoundProvider';


const SoundButton = () => {
  const [showMusicButton, setShowMusicButton] = useState(true);
  const [showVolumeSlider, setShowVolumeSlider] = useState(false);
  const { isSound, setIsSound, isPlaying, setIsPlaying, volume, setVolume } = useContext(SoundContext);

  const handleSoundButtonClick = () => {
    setIsSound(!isSound)
    setShowVolumeSlider(!showVolumeSlider);
    setIsPlaying(!isPlaying); // Toggle music playback
    // setShowMusicButton(!showMusicButton)
  }

  const handleMusicButtonClick = () => {
    setShowVolumeSlider(!showVolumeSlider);
    setIsPlaying(!isPlaying); // Toggle music playback
  };

  useEffect(() => {
    setShowVolumeSlider(isPlaying)
    setIsSound(isPlaying)
  }, []);

  return (
    <div className="sound-button-container">
      {/* Sound button */}
      <button
        className='sound-button'
        onClick={handleSoundButtonClick}
      >
      </button>

      {/* Music button, appears when the sound button is clicked */}
      {/* {showMusicButton && (
        <button
          className='music-button'
          onClick={handleMusicButtonClick}
        >
        </button>
      )} */}

      {/* Volume slider, appears when the music button is clicked */}
      {showVolumeSlider && (
        <VolumeSlider
          value={volume * 100}
          onChange={(e) => setVolume(e.target.value / 100)} // Convert percentage back to 0-1 range
          colorAfter="#E1E1E6"
          colorBefore="#A5AAB2"
          highlighted="#EB3E3E"
          size={12}
          marginLeft="10px"
        />
      )}
    </div>
  );
};

export default SoundButton;
