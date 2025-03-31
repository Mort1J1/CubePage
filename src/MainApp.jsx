import {useContext, useState} from "react";
import PropTypes from 'prop-types';
import { IconButton, useColorMode, Box, Spinner } from '@chakra-ui/react';
import { FaSun, FaMoon } from 'react-icons/fa';
import CubeScene from './Components/menucube/CubeScene';
import HomePage from './Components/home/HomePage';
import ProjectsList from './Components/projects/ProjectList';
import GameMenu from './Components/minigames/GameMenu';
import AboutMe from './Components/aboutMe/AboutMe';
 
import config from './config';
import SoundButton from './Utils/SoundButton';
import AudioVisualizerClassic from './Utils/AudioVisualizerClassic';
import { SoundContext } from './Utils/SoundProvider';
import { MenuProvider, MenuContext } from './Utils/MenuProvider';
import ScrollingBackground from './Components/aboutMe/ScrollingBackground';

import { useMediaQuery } from "@chakra-ui/react";

const MainApp = ({currentCategory, colorMode, toggleColorMode, handleCurrentCategoryChange, renderComponent, weather}) => {
  const [isMobile] = useMediaQuery("(max-width: 768px)");
  const [isLoading, setIsLoading] = useState(false);
  
  const { 
    menuCubeOn,
    setMenuCubeOn,
    menuArrowsOn,
    setMenuArrowsOn,
    menuButtonOn,
    setMenuButtonOn, } = useContext(MenuContext);

  return (
    <Box className="App" position="relative" minH="100vh" transitionProperty="background-image" transitionDuration="200ms" transitionTimingFunction="ease-in-out">
      <div className={currentCategory !== 'Menu' ? 'soundButtonHider' : 'soundButton'}>
        <SoundButton />
      </div>

      {!isMobile && <AudioVisualizerClassic />}
      <IconButton 
        position="absolute" 
        top={4} 
        right={4} 
        icon={colorMode === 'light' ? <FaMoon /> : <FaSun />} 
        onClick={toggleColorMode} 
        aria-label="Toggle color mode" 
        zIndex={9999} 
      />
      
      <CubeScene onCategoryChange={handleCurrentCategoryChange} />
      
      {isLoading ? (
        <Box display="flex" justifyContent="center" alignItems="center" minH="100vh">
          <Spinner size="xl" />
        </Box>
      ) : (
        <>
          {currentCategory === 'Home' && renderComponent && <HomePage weather={weather} />}
          {currentCategory === 'Projects' && renderComponent && <ProjectsList />}
          {currentCategory === 'About Me' && renderComponent && (
            <div>
              <AboutMe />
            </div>
          )}
          {currentCategory === 'Mini Games' && renderComponent && <GameMenu />}
        </>
      )}
    </Box>
  );
}

MainApp.propTypes = {
  currentCategory: PropTypes.string.isRequired,
  colorMode: PropTypes.string.isRequired,
  toggleColorMode: PropTypes.func.isRequired,
  handleCurrentCategoryChange: PropTypes.func.isRequired,
  renderComponent: PropTypes.bool.isRequired,
  weather: PropTypes.shape({
    temperature: PropTypes.number,
    conditions: PropTypes.string,
    // Add other weather properties as needed
  })
};

export default MainApp;
  