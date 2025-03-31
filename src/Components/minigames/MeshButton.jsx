import React, { Suspense, useRef } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { OrbitControls, useGLTF } from '@react-three/drei';
import { useSpring, a } from '@react-spring/three';

const MeshButton = ({ url, onClick }) => {
  const Model = () => {
    const { scene } = useGLTF(url);
    const modelRef = useRef();

    const [spring, api] = useSpring(() => ({
      scale: [1, 1, 1],
      rotation: [0, 0, 0],
      config: { mass: 3, tension: 200, friction: 50 },
      onRest: () => {
        if (spring.scale.get()[0] === 0.1) {
          if (onClick) {
            onClick();
          }
          api.start({ scale: [1, 1, 1], rotation: [0, 0, 0] }); // Reset animation
        }
      }
    }));

    const handleClick = () => {
      api.start({
        scale: [0.1, 0.1, 0.1],
        rotation: [0, 6 * Math.PI * 2, 0], // 3 full rotations
        reset: true,
      });
    };

    useFrame(() => {
      if (modelRef.current) {
        modelRef.current.rotation.y += 0.04;
      }
    });

    return (
      <a.primitive
        ref={modelRef}
        object={scene}
        onClick={handleClick}
        scale={spring.scale}
        rotation={spring.rotation}
      />
    );
  };

  return (
    <Canvas style={{ width: '30vw', height: '30vh' }} camera={{ position: [5, 0, 0], fov: 60 }}>
      <ambientLight intensity={0.5} />
      <pointLight position={[10, 0, 20]} intensity={1000} />
      <Suspense fallback={null}>
        <Model />
      </Suspense>
      {/* <OrbitControls /> */}
    </Canvas>
  );
};

export default MeshButton;
