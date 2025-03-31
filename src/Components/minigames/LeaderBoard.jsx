import React, { useEffect, useState } from 'react';
import axios from 'axios';

import config from '../../config';
import './LeaderBoard.css';  // Import CSS file here

const LeaderBoard = ({ game }) => {
  const [leaderBoard, setLeaderBoard] = useState([]);

  useEffect(() => {
    axios.get(`${config.API_BASE_URL}/minigames/leaderboard-${game}/`)
      .then(response => {
        const sortedData = response.data.sort((b, a) => b.score - a.score);
        setLeaderBoard(sortedData);
      })
      .catch(error => {
        console.error("There was an error fetching the leaderboard!", error);
      });
  }, [game]);

  return (
    <div className="leaderboard-container">
      <h1 className="leaderboard-header">Leaderboard</h1>
      <ul className="leaderboard-list">
        {leaderBoard.map((entry, index) => (
          <li key={index} className="leaderboard-item">
            <span>{entry.player_name}</span>
            <span>{entry.score}</span>
            <span>({new Date(entry.achieved_at).toLocaleString()})</span>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default LeaderBoard;
