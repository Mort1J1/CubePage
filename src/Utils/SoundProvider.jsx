import React, { createContext, useState, useEffect } from 'react';

export const SoundContext = createContext();

export const SoundProvider = ({ children }) => {
  const [isPlaying, setIsPlaying] = useState(false);
  const [isSound, setIsSound] = useState(false);
  const [volume, setVolume] = useState(0.2);
  const [audioContext, setAudioContext] = useState(null);
  const [analyser, setAnalyser] = useState(null);
  const [audio] = useState(new Audio('/Assets/Music/HjemmeSideBackground3.wav'));
  
  
  useEffect(() => {
    // Create and set up the AudioContext and AnalyserNode
    const context = new (window.AudioContext || window.webkitAudioContext)();
    const analyserNode = context.createAnalyser();
    const source = context.createMediaElementSource(audio);

    source.connect(analyserNode);
    analyserNode.connect(context.destination);
    analyserNode.fftSize = 256;

    setAudioContext(context);
    setAnalyser(analyserNode);

    context.resume()
    
    return () => {
      // Clean up the AudioContext
      context.close();
    };
  }, [audio]);

  useEffect(() => {
    if (audioContext) {
      audio.volume = volume; // Set the volume
    }
  }, [volume, audioContext]);

  useEffect(() => {
    if (audioContext) {
      audio.loop = true; // Set the audio to loop
      if (isPlaying) {
        audioContext.resume()
        audio.play().catch(err => console.error('Audio playback error:', err));
      }
    } else {
      audio.pause();
    }

    return () => {
      audio.pause(); // Pause the audio when the component unmounts
    };
  }, [isPlaying, audio]);

  useEffect(() => {
    if (audioContext) {
      audio.muted = !isSound; // Toggle audio muting
    }
  }, [isSound, audioContext]);

  return (
    <SoundContext.Provider value={{ isSound, setIsSound, isPlaying, setIsPlaying, volume, setVolume, audio, analyser }}>
      {children}
    </SoundContext.Provider>
  );
};
