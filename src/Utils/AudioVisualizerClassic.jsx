import React, { useContext, useEffect, useRef } from 'react';
import * as THREE from 'three';
import { SoundContext } from './SoundProvider';

const AudioVisualizer = () => {
  const { isPlaying, volume, analyser } = useContext(SoundContext);
  const containerRef = useRef(null);
  const isPlayingRef = useRef(isPlaying); // Use a ref to track isPlaying

  let angle = 0; // Initial angle for rotation

  useEffect(() => {
    let animationFrameId;

    if (analyser && containerRef.current) {
      const container = containerRef.current;
      const width = container.clientWidth;
      const height = container.clientHeight;

      // Three.js setup
      const scene = new THREE.Scene();
      const camera = new THREE.PerspectiveCamera(75, width / height, 0.1, 1000);

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
      pointLight.intensity = 100000
      scene.add(pointLight);

      // Fog
      const fog = new THREE.Fog(0x404040, 20, 10); // Color, near, far
      scene.fog = fog;

      // Create cubes
      const cubes = [];
      const particleMaterials = [];
      const geometry = new THREE.BoxGeometry();
      const material = new THREE.MeshStandardMaterial({ color: 0x100c31 });

    const gridSize = 4; // The number of cubes per row/column
    const spacing = 5; // The spacing between cubes
    let opacity_particle = 19

    for (let x = 0; x < gridSize; x++) {
        for (let y = 0; y < gridSize; y++) {
          for (let z = 0; z < gridSize; z++) {
            const cube = new THREE.Mesh(geometry, material);

            // Calculate the position for each cube
            cube.position.x = x * spacing - (gridSize * spacing) / 2;
            cube.position.y = y * spacing - (gridSize * spacing) / 2;
            cube.position.z = z * spacing - (gridSize * spacing) / 2;

            scene.add(cube);
            cubes.push(cube);

            // Create particle materials for trails
            const trailMaterial = new THREE.PointsMaterial({
              color: 0xffffff,
              size: 0.1,
              opacity: 0.5,
              transparent: true,
              depthWrite: false,
            });
            

            particleMaterials.push(trailMaterial);
          }
        }
      }

      const particles = [];
      const maxTrailLength = 20;

      cubes.forEach((cube, i) => {
        const particleGeometry = new THREE.BufferGeometry();
        const positions = new Float32Array(maxTrailLength * 3);
        particleGeometry.setAttribute('position', new THREE.BufferAttribute(positions, 3));
        const particleSystem = new THREE.Points(particleGeometry, particleMaterials[i]);
        particles.push(particleSystem);
        // scene.add(particleSystem);
      });

      camera.position.z = 100;

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

            // Rotate the cube based on the data value
            cube.rotation.x += (data / 50000);
            cube.rotation.y += (data / 50000);

            cube.position.y += (data / 5000 * Math.cos(performance.now() / 50000 + index) * 1.5) * 2;
            cube.position.z += (data / 5000 * Math.cos(performance.now() / 50000 + index) * 1.5) * 2;
            cube.position.x += (Math.sin(performance.now() / 5000 + index) * 1.5)*.5;

            // Trail effect
            const particleSystem = particles[index];
            const positions = particleSystem.geometry.attributes.position.array;

            // Shift positions and add current cube position
            for (let i = positions.length - 3; i >= 3; i -= 3) {
                positions[i] = positions[i - 3];
                positions[i + 1] = positions[i - 2];
                positions[i + 2] = positions[i - 1];
            }

            positions[0] = cube.position.x;
            positions[1] = cube.position.y;
            positions[2] = cube.position.z;

            particleSystem.geometry.attributes.position.needsUpdate = true;

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

            camera.position.x = centerX + radius * Math.cos(angle);
            camera.position.z = centerZ + radius * Math.sin(angle);
            camera.position.y = centerZ + radius * Math.sin(angle);
            // pointLight.position.x = centerX + radius * Math.cos(angle);
            // pointLight.position.z = centerZ + radius * Math.sin(angle);
            camera.position.y = 0
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
  }, [analyser]);

  return (
    <div className="audio-visualizer" ref={containerRef} style={{ width: '100vw', height: '100vh', position: 'absolute' }}>
      {/* Container for Three.js renderer */}
    </div>
  );
};

export default AudioVisualizer;
