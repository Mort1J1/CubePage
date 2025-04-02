import React, { useContext, useEffect, useRef, useState } from 'react';
import * as THREE from 'three';
import { SoundContext } from './SoundProvider';
import { MenuProvider, MenuContext } from '../Utils/MenuProvider.jsx';


const AudioVisualizer = () => {
  const { isPlaying, analyser } = useContext(SoundContext);
  const containerRef = useRef(null);
  const isPlayingRef = useRef(isPlaying); // Use a ref to track isPlaying
  const [isLoaded, setIsLoaded] = useState(false)
  const { menuCubeOn } = useContext(MenuContext);

  let angle = 0; // Initial angle for rotation
  
  const createCircle = (cubes, scene) => {

    const material = new THREE.MeshStandardMaterial({ color: 0x100c31 });
    
    let geo;
    let offset;
    let radius;
    let cubeCount;
  
    if (menuCubeOn) {
      geo = new THREE.BoxGeometry();
      offset = 10;
      radius = 10;
      cubeCount = 24; // Number of cubes in the circle
    } else {
      geo = new THREE.BoxGeometry(1,1, 1);
      offset = 0;
      radius = 5;
      cubeCount = 12; // Fewer cubes in a smaller circle
    }
  
    const geometry = geo;
  
    if (!isLoaded) {
      setIsLoaded(true);
    }
  
    // Create cubes and position them in a circular arrangement
    for (let i = 0; i < cubeCount; i++) {
      const angle = (i / cubeCount) * Math.PI * 2; // Evenly distribute cubes around the circle
  
      const cube = new THREE.Mesh(geometry, material);
  
      // Calculate the position of each cube on the circle
      cube.position.x = Math.cos(angle) * radius + offset; // X coordinate (circle formula)
      cube.position.y = 0; // Y remains fixed if we're making a flat circle
      cube.position.z = Math.sin(angle) * radius; // Z coordinate (circle formula)
  
      scene.add(cube);
      cubes.push(cube);
    }
  };

  useEffect(() => {
    let animationFrameId;

    if (analyser && containerRef.current) {
      const container = containerRef.current;
      const width = container.clientWidth;
      const height = container.clientHeight;

      // Three.js setup
      const scene = new THREE.Scene();
      const camera = new THREE.PerspectiveCamera(75, width / height, 0.6, 500);

      const renderer = new THREE.WebGLRenderer({ alpha: true });
      renderer.setSize(width, height);
      renderer.setClearColor(0x000000, 0); // Transparent background
      container.appendChild(renderer.domElement);

      // Lighting
      const ambientLight = new THREE.AmbientLight(0x404040); // Soft white light
      ambientLight.intensity = 4000
      scene.add(ambientLight);

      const pointLight = new THREE.PointLight(0xffffff, 1, 100); // White light, intensity, distance
      pointLight.position.set(0, 0, 0); // Position of the light
      pointLight.intensity = 10000
      scene.add(pointLight);

      // Fog
      const fog = new THREE.Fog(0x404040, 20, 10); // Color, near, far
      scene.fog = fog;

      // Create cubes
      const cubes = [];
      const particleMaterials = [];

      // createCube(cubes, scene)
      createCircle(cubes, scene)
      // camera.position.z = 100;

      // Render loop
      const render = () => {
        animationFrameId = requestAnimationFrame(render);

        if (analyser) {
          const bufferLength = analyser.frequencyBinCount;
          const dataArray = new Uint8Array(bufferLength);
          analyser.getByteFrequencyData(dataArray);

            cubes.forEach((cube, index) => {
            const data = dataArray[index % bufferLength];
            
            // Scale the cube based on the data value
            cube.scale.y = data / 50 + 1;
            // cube.scale.x = data / 100 + 1;
            // cube.scale.z = data / 100 + 1;

            // Change color based on the data value
            // const colorValue = data / 255;
            // cube.material.color.setHSL(colorValue, 1, 0.5);

            // Rotate the cube based on the data value
            cube.rotation.x += (data / 50000);
            cube.rotation.y += (data / 50000);

            // Add a pulsating effect by modifying the position slightly
            // console.log('naillo')
            if (isPlaying){

            cube.position.y += (data / 5000 * Math.cos(performance.now() / 50000 + index) * 1.5) * 2;
            // cube.position.z += (data / 5000 * Math.cos(performance.now() / 50000 + index) * 1.5) * 2;
            cube.position.x += (Math.sin(performance.now() / 5000 + index) * 1.5)*.5;

            }

            // You can also add a slight rotation to make it feel more dynamic
            cube.rotation.z += 0.000001;
            });

        //   camera.rotateY(.0001)

          
    // Update the angle for rotation
    angle += 0.001; // Adjust the speed of rotation here

            // Calculate the new camera position
            const radius = 100; // Distance from the center of rotation
            const centerX = 0; // Center of rotation x-coordinate
            const centerY = 0; // Center of rotation y-coordinate
            const centerZ = 0; // Center of rotation z-coordinate

            // camera.position.x = centerX + radius * Math.cos(angle);
            camera.position.y = centerZ + radius * Math.sin(angle);
            // camera.position.z = centerZ + radius * Math.sin(angle);
            // pointLight.position.x = centerX + radius * Math.cos(angle);
            // pointLight.position.z = centerZ + radius * Math.sin(angle);
            // camera.position.z = 0
            // Ensure the camera is looking at the center
            camera.lookAt(centerX, centerY, centerZ);
          renderer.render(scene, camera);
        }
      };

      render();

      return () => {
        // Cleanup function
        if (animationFrameId) {
          cancelAnimationFrame(animationFrameId);
        }
        // Remove the canvas from the DOM
        container.removeChild(renderer.domElement);

        // Dispose of Three.js objects
        cubes.forEach(cube => {
          cube.geometry.dispose();
          cube.material.dispose();
        });

        // Clear the scene
        scene.traverse(object => {
          if (object.geometry) {
            object.geometry.dispose();
          }
          if (object.material) {
            object.material.dispose();
          }
        });

        // Dispose of the renderer
        renderer.dispose();
      };
    }
  }, [analyser, isPlaying, menuCubeOn]);

  return (
    <div className="audio-visualizer" ref={containerRef} style={{ width: '100vw', height: '100vh', position: 'absolute' }}>
      {/* Container for Three.js renderer */}
    </div>
  );
};

export default AudioVisualizer;
