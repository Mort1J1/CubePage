import React, { useState, useEffect, useContext } from 'react';
import { Canvas, useThree } from '@react-three/fiber';
import { a, useSpring, config } from '@react-spring/three';
import Cube from './Cube'; // Ensure the correct path
import useWindowSize from './useWindowSize';
import { MenuProvider, MenuContext } from '../../Utils/MenuProvider.jsx';


// Component to handle orthographic camera setup
const OrthographicCameraSetup = () => {

  const { camera, size } = useThree();
  
  React.useEffect(() => {
      const aspect = size.width / size.height;
      const d = size.height / 2; // Define d based on height

      // Set camera parameters
      camera.left = -aspect * d;
      camera.right = aspect * d;
      camera.top = d;
      camera.bottom = -d;
      camera.near = 0.1;
      camera.far = 10;
      camera.position.set(0, 0, 4); // Position the camera
      camera.updateProjectionMatrix();
  }, [camera, size]);

  return null;
};


const CubeScene = ( {onCategoryChange} ) => {
    
  const { 
    menuCubeOn,
    setMenuCubeOn,
    menuArrowsOn,
    setMenuArrowsOn,
    menuButtonOn,
    setMenuButtonOn, } = useContext(MenuContext);

    const [isStatic, setIsStatic] = useState(false);
    const { width, height } = useWindowSize();
    const [currentCategory, setCurrentCategory] = useState('Home');
    const [direction, setDirection] = useState(null);
    const [enableTouch, setEnableTouch] = useState(true)

    useEffect(() => {
      console.log('YOLO')
      if (isStatic){
        setMenuCubeOn(false)
      }
      else{
        setMenuCubeOn(true)
      }
    }, [isStatic]);

    useEffect(() => {
      if (isStatic)
        {
          setEnableTouch(false)
        }
      else{
        setEnableTouch(true)
      }
    }, [isStatic]);

    const handleLeftClick = () => {
      setDirection('left');
    };
  
    const handleRightClick = () => {
      setDirection('right');
    };
  
    const resetDirection = () => {
      setDirection(null);
    };
    
    const handleCurrentCategory = (category) => {
        // Handle the category change here
        setCurrentCategory(category)
      };

    const calculateStaticValues = (width, height) => {
        // console.log(width, height)
        const staticPosition = [-width / 200, height/ 200, -2]; // Top-left corner in normalized device coordinates
        // console.log(staticPosition)
        const staticScale = [0.25, 0.25, 0.25];
        return { staticPosition, staticScale };
      };
    
      const { position, scale, rotation } = useSpring({
        position: isStatic ? calculateStaticValues(width, height).staticPosition : [0, 0, 0],
        scale: isStatic ? calculateStaticValues(width, height).staticScale : [1, 1, 1],
        rotation: isStatic ? [2.8, Math.PI * 6 + 2, 0.1] : [0, 0, 0],
        config: {mass: 1, tension: 30, friction: 10},
      });
  
    const toggleCube = (currenCategory) => {
      if (isStatic){
        onCategoryChange("Menu")
        setMenuArrowsOn(true)
      }
      else {
        onCategoryChange(currenCategory)
        setMenuArrowsOn(false)
      }
      setIsStatic(!isStatic);
    };
  
    return (
      <div>
        <div className='category'>
        { menuArrowsOn &&
        <button onClick={handleLeftClick} className='lcat'> &lt; </button>
        }

        { menuButtonOn &&
          <div onClick={() => toggleCube(currentCategory)} className={'maincat'}>{!isStatic ? currentCategory : 'Menu'}</div>
        }
        
        { menuArrowsOn &&
          <button onClick={handleRightClick} className='rcat'> &gt; </button>
        }

        </div>
        <Canvas style={{ position: 'absolute', top: 0, left: 0, width: '100%', height: '100%', zIndex: '0'}}>
          {/* <color attach="background" args={['grey']} /> */}
          <OrthographicCameraSetup />
          <fog attach="fog" args={['#e0e0e0', 0.05, 10]} />
          <ambientLight />
          <pointLight position={[-2, 0, 10]} intensity={2500} />
          <a.group position={position} scale={scale} rotation={rotation}>
            <Cube onClick={() => toggleCube(currentCategory)} preventDefaultTouch={enableTouch} direction={direction} resetDirection={resetDirection} isStatic={isStatic} handleCurrentCategory={handleCurrentCategory} currentlyCategory={currentCategory}/>
          </a.group>
        </Canvas>
      </div>
    );
  };
  
  export default CubeScene;