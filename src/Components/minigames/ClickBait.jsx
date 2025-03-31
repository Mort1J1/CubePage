import React, { useState, useEffect } from 'react';
import { Center, Box, Button, Heading } from '@chakra-ui/react';

const Clickbait = () => {
  const [started, setStarted] = useState(false);
  const [countdown, setCountdown] = useState(3);
  const [clicks, setClicks] = useState(0);
  const [gameOver, setGameOver] = useState(false);
  const [postGameTimer, setPostGameTimer] = useState(false)

  const startGame = () => {
    setStarted(true);
    setCountdown(3);
    setClicks(0);
    setGameOver(false);

    // Start countdown inside the button
    const countdownInterval = setInterval(() => {
      setCountdown((prev) => prev - 1);
    }, 1000);

    // Clear interval once countdown reaches 0
    setTimeout(() => {
      clearInterval(countdownInterval);
    }, 3000); // Clear interval after 3 seconds (when countdown completes)
  };

  useEffect(() => {
    if (countdown === 0 && started) {
      const gameDuration = 5000; // 5 seconds
      const gameTimer = setTimeout(() => {
        setStarted(false);
        setGameOver(true);
        setPostGameTimer(true)
      }, gameDuration);
      return () => clearTimeout(gameTimer);
    }
  }, [countdown, started]);

  useEffect(() => {
    const timer = setTimeout(() => {
      setPostGameTimer(false); // Set postGameTimer to false after 5000ms
    }, 2000);

    return () => clearTimeout(timer); // Cleanup timeout if component unmounts or postGameTimer changes
  
  }, [postGameTimer]);

  const handleClick = () => {
    if (started && countdown === 0 && !gameOver) {
      setClicks((prev) => prev + 1);
    }
  };

  return (
    <Center height="100vh" top='50%'>
      <Box textAlign="center">
        {!started && !gameOver && (
          <Box>
            <Heading mb={4}>Press the play button to begin the game</Heading>
              <Button onClick={startGame} colorScheme="teal" size="lg">
              Play
            </Button>
          </Box>
        )}
        {started && (
          <Box>
            <Button
              onClick={handleClick}
              size="lg"
              height="200px"
              width="200px"
              borderRadius="50%"
              fontSize="24px"
              display="flex"
              justifyContent="center"
              alignItems="center"
              mx="auto"
              userSelect="none" // Prevent text selection
              pointerEvents="auto" // Enable button click events
              colorScheme="teal"
            >
              {countdown > 0 ? countdown : clicks === 0 ? 'Click now!' : clicks}
            </Button>
          </Box>
        )}
        {gameOver && (
          <Box>
            <Heading mb={4}>Your score is: {clicks} clicks</Heading>
            { !postGameTimer &&
            <Button onClick={startGame} colorScheme="teal" size="lg">
              Play Again?
            </Button>
            }
          </Box>
        )}
      </Box>
    </Center>
  );
};

export default Clickbait;
