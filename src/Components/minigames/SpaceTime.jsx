import React, { useState, useEffect, useRef } from 'react';
import LeaderBoard from './LeaderBoard';
import config from '../../config';

const SpaceTime = () => {
  const [started, setStarted] = useState(false);
  const [countdown, setCountdown] = useState(3);
  const [waiting, setWaiting] = useState(false);
  const [startTime, setStartTime] = useState(null);
  const [reactionTime, setReactionTime] = useState(null);
  const [tooEarly, setTooEarly] = useState(false);
  const [playerName, setPlayerName] = useState('');
  const timeoutRef = useRef(null);

  const startGame = () => {
    setStarted(true);
    setCountdown(3);
    setReactionTime(null);
    setTooEarly(false);
  };

  useEffect(() => {
    if (started && countdown > 0) {
      const countdownInterval = setInterval(() => {
        setCountdown((prev) => prev - 1);
      }, 1000);
      return () => clearInterval(countdownInterval);
    } else if (started && countdown === 0) {
      const randomWaitTime = Math.random() * 9500 + 500;
      timeoutRef.current = setTimeout(() => {
        setStartTime(Date.now());
        setWaiting(true);
      }, randomWaitTime);
    }
  }, [started, countdown]);

  useEffect(() => {
    const handleKeyPress = (e) => {
      if (e.key === ' ') {
        if (waiting) {
          const endTime = Date.now();
          setReactionTime(endTime - startTime);
          setWaiting(false);
        } else if (countdown > 0 || (countdown === 0 && !waiting && reactionTime === null)) {
          setStarted(false);
          setCountdown(3);
          setReactionTime(null);
          setTooEarly(true);
          clearTimeout(timeoutRef.current);
          setTimeout(() => {
            setTooEarly(false);
          }, 2000);
        }
      }
    };
    window.addEventListener('keydown', handleKeyPress);
    return () => window.removeEventListener('keydown', handleKeyPress);
  }, [waiting, startTime, countdown, reactionTime]);

  const handleSubmit = async () => {
    const response = await fetch(`${config.API_BASE_URL}/minigames/submit-score/`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        player_name: playerName,
        score: reactionTime,
      }),
    });
    if (response.ok) {
      alert('Score submitted successfully!');
      setPlayerName('');
    } else {
      alert('Failed to submit score.');
    }
  };

  return (
    <div className="space-time-wrapper">
      {!started && !tooEarly && (
        <div className="start-screen">
          <h1>Press the start button to begin the game</h1>
          <button className="start-button" onClick={startGame}>Start</button>
        </div>
      )}
      {started && countdown > 0 && <h1>Get Ready... {countdown}</h1>}
      {started && countdown === 0 && !waiting && reactionTime === null && (
        <h1>Wait for it...</h1>
      )}
      {waiting && <h1>Press SPACE now!</h1>}
      {tooEarly && (
        <div className="too-early-screen">
          <h1>Too early!</h1>
          <button className="start-button" onClick={startGame}>Start Again</button>
        </div>
      )}
      {reactionTime !== null && (
        <div className="result-screen">
          <h1>Your reaction time is: {reactionTime} ms</h1>
          <input
            className="name-input"
            placeholder="Enter your name"
            value={playerName}
            onChange={(e) => setPlayerName(e.target.value)}
          />
          <button className="submit-button" onClick={handleSubmit}>Submit Score</button>
          <button className="play-again-button" onClick={startGame}>Play Again</button>
          <LeaderBoard game={'spacetime'} />
        </div>
      )}
      {!started && <LeaderBoard game={'spacetime'} />}
    </div>
  );
};

export default SpaceTime;
