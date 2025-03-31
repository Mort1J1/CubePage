import React, { useState } from 'react';
import { a, useSpring } from '@react-spring/web';
import SpaceTime from './SpaceTime';
import Clickbait from './ClickBait';
import './MiniGameStyles.css';
import MeshButton from './MeshButton';

const clickbaitButton = './Assets/Arrow.glb';
const spacetimeButton = './Assets/Lightning.glb'; // Replace with actual path

const GameMenu = React.memo(() => {
  const [currentGame, setCurrentGame] = useState(null);
  const [canvasKey, setCanvasKey] = useState(0);

  const enterSpring = useSpring({
    from: {
      opacity: 0,
      transform: 'scale(1) rotate(0deg)',
    },
    to: {
      opacity: 1,
      transform: 'scale(1) rotate(0)',
    },
    config: { mass: 2, tension: 300, friction: 50 },
  });

  const handleButtonClick = (game) => {
    setCurrentGame(game);
  };

  const renderCurrentGame = () => {
    switch (currentGame) {
      case 'SpaceTime':
        return <SpaceTime />;
      case 'Clickbait':
        return <Clickbait />;
      default:
        return (
          <div className='position-wrapper'>
            <a.div style={enterSpring}>
              <div className='GamesWrapper'>
                {/* <div style={{ textAlign: 'center', marginTop: '50px' }}> */}
                  <div className='ButtonWrapper'>
                    <div className='button-container'>
                      <MeshButton key={`${canvasKey}-clickbait`} url={clickbaitButton} onClick={() => handleButtonClick('Clickbait')} />
                    </div>
                    <div className='button-container'>
                      <MeshButton key={`${canvasKey}-spacetime`} url={spacetimeButton} onClick={() => handleButtonClick('SpaceTime')} />
                    </div>
                  </div>
                {/* </div> */}
              </div>
            </a.div>
          </div>
        );
    }
  };

  return <div>{renderCurrentGame()}</div>;
});

export default GameMenu;
