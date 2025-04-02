import MainApp from './MainApp';
import './App.css'; // Ensure App.css does not override transitions
import { useState, useEffect, useContext, useMediaQuery } from 'react';
import axios from 'axios';
import {Box, useColorMode, useToast, ColorModeScript} from '@chakra-ui/react';
import theme from './theme';

import config from './config';
import { SoundContext } from './Utils/SoundProvider';
import ErrorBoundary from './Utils/ErrorBoundary';



function App() {

  const {isPlaying} = useContext(SoundContext);
  const [currentCategory, setCurrentCategory] = useState('Menu');
  const [renderComponent, setRenderComponent] = useState(false);
  const [weather, setWeather] = useState(null);
  const {colorMode, toggleColorMode} = useColorMode();
  const [showVisualizer, setShowVisualizer] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const toast = useToast();

  // Set initial color mode to dark
  useEffect(() => {
    if (colorMode === 'light') {
      toggleColorMode();
    }
  }, []);

  const fetchData = async () => {
    setIsLoading(true);
    try {
      const response = await axios.get(`${config.API_BASE_URL}/home/current-weather/`);
      setWeather(response.data);
    } catch (error) {
      console.error('Error fetching data:', error);
      toast({
        title: 'Error fetching weather data',
        description: 'Unable to load weather information. Please try again later.',
        status: 'error',
        duration: 5000,
        isClosable: true,
      });
    } finally {
      setIsLoading(false);
    }
  };

  // Use a timeout to delay showing the AudioVisualizer
  useEffect(() => {
    if (isPlaying) {
      // Set a timeout to delay rendering AudioVisualizer
      const timer = setTimeout(() => {
        setShowVisualizer(true);
      }, 1000); // Delay in milliseconds (e.g., 1000ms = 1 second)

      return () => clearTimeout(timer); // Clean up the timeout on unmount or when isPlaying changes
    } else {
      setShowVisualizer(false); // Hide visualizer when not playing
    }
  }, [isPlaying]);

  useEffect(() => {
    fetchData();
  }, []);

  useEffect(() => {
    if (currentCategory === 'Menu') {
      setRenderComponent(false);
    } else {
      setTimeout(() => {
        setRenderComponent(true);
      }, 500);
    }
  }, [currentCategory]);

  const handleCurrentCategoryChange = (category) => {
    setCurrentCategory(category);
  };

  return (
    <>
      <ColorModeScript initialColorMode={theme.config.initialColorMode} />
      <ErrorBoundary>
        <Box>
          <MainApp currentCategory={currentCategory} colorMode={colorMode} toggleColorMode={toggleColorMode} handleCurrentCategoryChange={handleCurrentCategoryChange} renderComponent={renderComponent} weather={weather} isLoading={isLoading} />
        </Box>
      </ErrorBoundary>
    </>
  );
}

export default App;
