import React, { useRef, useState, useEffect, useContext } from 'react';
import { a, useSpring } from '@react-spring/three';
import { useDrag } from '@use-gesture/react';
import { Text } from '@react-three/drei';
import { useFrame } from '@react-three/fiber';
import { Howl } from 'howler'; // Importing Howler to play sounds

import { SoundContext } from '../../Utils/SoundProvider';
import styles from './Cube.css'; // Import CSS module
import { useConst } from '@chakra-ui/react';

const textStyles = {
  fontSize: 0.15,
  color: 'black',
  anchorX: 'center',
  anchorY: 'middle',
  fontWeight: 3000
  // Add more shared text styles here
};

const snapToClosestFace = (x, y) => {
  const snapX = Math.round(x / (Math.PI / 2)) * (Math.PI / 2);
  const snapY = Math.round(y / (Math.PI / 2)) * (Math.PI / 2);

  return [snapX, snapY, 0];
};

const Cube = ({ preventDefaultTouch ,direction, resetDirection, position, scale, onClick, isStatic, handleCurrentCategory }) => {
  
  const { isSound } = useContext(SoundContext)
  const cubeRef = useRef();
  const [isSoundInitialized, setIsSoundInitialized] = useState(false);
  const initialMousePosition = useRef(null);
  const initialRotation = useRef(null);
  const dragThreshold = 5; // Threshold to distinguish between click and drag
  let isDragging = false;
  const categories = ['Home', 'Mini Games', 'About Me', 'Projects']
  const [index, setIndex] = useState(0);

  const [spring, api] = useSpring(() => ({
    rotation: [0, 0, 0],
    config: { mass: 1.3, tension: 100, friction: 10 },
  }));

  const soundRef = useRef(null);

  useEffect(() => {
    // Initialize the Howl instance and store it in the ref
    soundRef.current = new Howl({
      src: ['/Assets/Sound/Click.wav'],
      preload: true, // Ensure the sound is preloaded
    });
  }, []); // Empty dependency array ensures this runs only once when the component mounts


  // Function to play a sound using Howler
  const playSound = (volume) => {
    // console.log('Attempting to play sound');
    if (soundRef.current && isSound) {
      soundRef.current.volume(volume)
      soundRef.current.play();
    }
  };

  const rotateCube = (direction) => {
    const [currentX, currentY, currentZ] = spring.rotation.get();

    // Determine the new Y rotation based on the direction ('left' or 'right')
    const rotationAmount = Math.PI / 2; // Rotate by 90 degrees
    const newRotationY = direction === 'left' ? currentY + rotationAmount : currentY - rotationAmount;
  
    // Snap to the closest face to ensure perfect 90-degree increments
    const snappedRotation = snapToClosestFace(currentX, newRotationY);
    const [snapX, snapY] = snappedRotation;
  
    // Update the spring rotation to the new snapped rotation
    api.start({ rotation: [snapX, snapY, currentZ] });

    let newIndex = index

    if (direction === 'right'){
      newIndex = (newIndex + 1) % 4
    }
    //left
    else {
      newIndex += 4
      newIndex = (newIndex - 1) % 4
    }

    setIndex(newIndex)
    handleCurrentCategory(categories[newIndex])
    
  
    // Reset the direction to null after rotation
    resetDirection();
  };

  // Use useEffect to detect changes in the direction prop
  useEffect(() => {
    if (direction) {
      rotateCube(direction);
    }
  }, [direction]);


  const [isInteracting, setIsInteracting] = useState(false);
  const [ignoreNextPlay, setIgnoreNextPlay] = useState(false);
  const debounceTimeout = useRef(null);

  // Event listeners for mouse and touch events
    // Event listeners for mouse and touch events
  const handleMouseDown = () => {
    setIsInteracting(true);
    debounceTimeout.current = setTimeout(() => setIgnoreNextPlay(false), 200); // Debounce delay (200ms)
  };

  const handleMouseUp = () => {
    setIsInteracting(false);
    setIgnoreNextPlay(true); // Ignore the next play after mouse up
  };

  const handleTouchStart = () => {
    setIsInteracting(true);
    debounceTimeout.current = setTimeout(() => setIgnoreNextPlay(false), 200); // Debounce delay (200ms)
  };
  
  const handleTouchEnd = () => {
    setIsInteracting(false);
    setIgnoreNextPlay(true); // Ignore the next play after touch end
  };

  window.addEventListener('mousedown', handleMouseDown);
  window.addEventListener('mouseup', handleMouseUp);

  window.addEventListener('touchstart', handleTouchStart);
  window.addEventListener('touchend', handleTouchEnd);

  // Keep track of the last snapped rotation
  const lastSnapY = useRef(0);

  // useFrame to monitor rotation and play sound when aligned
  useFrame(() => {
    const [x, y] = spring.rotation.get();
    const snapY = Math.round(y / (Math.PI / 2)) * (Math.PI / 2);

    // If the rotation is aligned and different from the last snap, play the sound
    if (Math.abs(y - snapY) < 0.2 && (y-snapY) !== 0 && snapY !== lastSnapY.current && isInteracting) {
      // Generate a random volume between 20% (0.2) and 40% (0.4)
      const randomVolume = Math.random() * (0.35 - 0.25) + 0.2;
      playSound(randomVolume);
      lastSnapY.current = snapY; // Update the last snapped rotation
    }
  });


  useEffect(() => {

    const preventDefault = (e) => {
      e.preventDefault();
    };

    if (preventDefaultTouch){
      // Attach the event listener
      window.addEventListener('touchmove', preventDefault, { passive: false });
      
      // Cleanup the event listener on component unmount
      return () => {
        window.removeEventListener('touchmove', preventDefault);
      };
    }

  }, [preventDefaultTouch]);

  const determineCategory = (snappedX, snappedRotation) => {

    let category;

    if (Math.abs(snappedX) === 0) {
      category = 'Home'
      snappedRotation[1] = 0
      setIndex(0)
    } // Check if within tolerance range of 0
    else if (Math.abs(snappedX) === 1.57){
      category = 'Projects'; // Check if within tolerance range of π/2
      snappedRotation[1] = 1.57
      setIndex(1)
    } 
    else if (Math.abs(snappedX) === 3.14){
      category = 'About Me'; // Check if within tolerance range of -π
      snappedRotation[1] = 3.14
      setIndex(2)
    } 
    else if (Math.abs(snappedX) === 4.71){
      category = 'Mini Games'; // Check if within tolerance range of -π/2
      snappedRotation[1] = 4.71
      setIndex(3)
    }
    // console.log('kategoriiiii', category)

    handleCurrentCategory(category);
  }

  const bind = useDrag(
    ({ offset: [mx, my], event, movement: [dx, dy]}) => {

      if (event.type === "pointerdown" || event.type === "mousedown" || isStatic) {

        initialMousePosition.current = [mx, my];
        initialRotation.current = snapToClosestFace(...spring.rotation.get());
        isDragging = false;
      }

      if (event.type === "pointerup" || event.type === "mouseup") {
        if (initialMousePosition.current) {
          const [x, y, z] = spring.rotation.get();
          const snappedRotation = snapToClosestFace(x, y);
          api.start({ rotation: snappedRotation });
          initialMousePosition.current = null;
          initialRotation.current = snappedRotation;

          if (!isStatic) {
            // let category = 'Menu'; // Default to 'Menu'
            let snappedX = snappedRotation[1]; // Extract snapped X rotation
            // console.log('snapped initially', snappedX)
            // Apply modulo operation to ensure rotation stays within range
            snappedX = ((snappedX + 2 * Math.PI) % (2 * Math.PI)).toFixed(2); // Round to 2 decimal places
            determineCategory(snappedX, snappedRotation)

            // console.log(Math.abs(snappedX))
          }

        }

        if (Math.abs(dx) < dragThreshold && Math.abs(dy) < dragThreshold && !isDragging) {
          onClick();
        }
        return;
      }

      if (!initialMousePosition.current || !initialRotation.current) return;

      if (Math.abs(dx) >= dragThreshold || Math.abs(dy) >= dragThreshold) {
        isDragging = true;
      }

      const [initialMouseX, initialMouseY] = initialMousePosition.current;
      const displacementX = mx - initialMouseX;
      const displacementY = my - initialMouseY;

      const [initialRotX, initialRotY, initialRotZ] = initialRotation.current;
      const newRotation = [
        initialRotX + displacementY / 800,
        initialRotY + displacementX / 100,
        initialRotZ,
      ];

      api.start({ rotation: newRotation });
    },
    { pointerEvents: true } // Enable pointer events to support touch and mouse events

  );

  return (
    <a.group style={{ position: 'relative', zIndex: 9999 }} ref={cubeRef} {...bind()} rotation={spring.rotation} position={position} scale={scale}>
      <mesh>
        <Text {...textStyles}  position={[0, 0, 0.52]}>
          Home
        </Text>
        <meshStandardMaterial attach="material" color="red" />
      </mesh>
      <mesh rotation={[0, Math.PI, 0]}>
        <Text {...textStyles} position={[0, 0, 0.52]}>
          About Me
        </Text>
      </mesh>
      <mesh rotation={[-Math.PI / 2, 0, 0]}>
        <Text {...textStyles} position={[0, 0, 0.52]}>
          
        </Text>
      </mesh>
      <mesh rotation={[Math.PI / 2, 0, 0]}>
        <Text position={[0, 0, 0.52]} fontSize={0.1}>
          
        </Text>
      </mesh>
      <mesh rotation={[0, -Math.PI / 2, 0]}>
        <Text {...textStyles} position={[0, 0, 0.52]}>
          Projects
        </Text>
      </mesh>
      <mesh rotation={[0, Math.PI / 2, 0]}>
        <Text {...textStyles} position={[0, 0, 0.52]}>
          Mini Games
        </Text>
      </mesh>
      <mesh>
        <boxGeometry args={[1, 1, 1, 1, 1, 1]} matrix={20} />
        <meshStandardMaterial attach="material" color="#100c31" metalness={0.8} transparent={true} opacity={.9} roughness={0.51} />
      </mesh>
      <sphereGeometry args={[1,3,3]}></sphereGeometry>
    </a.group>
  );
};

export default Cube;
