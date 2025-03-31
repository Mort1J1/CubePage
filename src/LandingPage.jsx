import {useContext} from 'react';
import PropTypes from 'prop-types';
import './LandingPage.css'
import { SoundContext } from './Utils/SoundProvider';
import { Box, Heading, Button, ButtonGroup } from '@chakra-ui/react';


function LandingPage({ setLandingPage }) {
  const { isPlaying, setIsPlaying } = useContext(SoundContext);


  const handleYes = () =>{
    setLandingPage(false)
    setIsPlaying(true)
  }

    return (
        <Box
            display="flex"
            flexDirection="column"
            alignItems="center"
            justifyContent="center"
            minH="100vh"
            p={4}
            textAlign="center"
        >
            <Heading as="h1" size="xl" mb={8} className='title-landing'>
                Do you want to visit the site with music?
            </Heading>
            <ButtonGroup spacing={4}>
                <Button
                    colorScheme="gray"
                    onClick={() => setLandingPage(false)}
                    size="lg"
                >
                    No
                </Button>
                <Button
                    colorScheme="blue"
                    onClick={handleYes}
                    size="lg"
                >
                    Yes
                </Button>
            </ButtonGroup>
        </Box>
    );
}

LandingPage.propTypes = {
    setLandingPage: PropTypes.func.isRequired,
};

export default LandingPage;
