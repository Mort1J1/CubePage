import React, { useState, useEffect, useRef } from 'react';
import { useSprings, animated } from 'react-spring';

const MagneticEffect = () => {
  const numParticles = 5;
  const radius = 200;
  const centerX = window.innerWidth / 2;
  const centerY = window.innerHeight / 2;

  const initialParticles = Array.from({ length: numParticles }, (_, i) => {
    const angle = (i / numParticles) * 2 * Math.PI;
    return {
      id: i + 1,
      x: centerX + radius * Math.cos(angle),
      y: centerY + radius * Math.sin(angle),
      vx: 0,
      vy: 0,
      color: ['red', 'green', 'blue', 'purple', 'orange'][i],
    };
  });

  const attractionMap = {
    1: 2,
    2: 3,
    3: 4,
    4: 5,
    5: 1,
  };

  const screenWidth = window.innerWidth;
  const screenHeight = window.innerHeight;
  const particleSize = 50;
  const boundaryForce = 0.5;
  const attractionStrength = 0.36;
  const damping = 0.95;

  const [particles, setParticles] = useState(initialParticles);
  const [dragging, setDragging] = useState(null);
  const canvasRef = useRef(null);

  const calculateForce = (particle, target) => {
    const dx = target.x - particle.x;
    const dy = target.y - particle.y;
    const distance = Math.sqrt(dx * dx + dy * dy);
    if (distance === 0) return { fx: 0, fy: 0 };
    const force = attractionStrength / distance;
    return {
      fx: dx * force,
      fy: dy * force,
    };
  };

  const applyBoundaryForces = (particle) => {
    let fx = 0;
    let fy = 0;

    if (particle.x < particleSize / 2) {
      fx = boundaryForce;
    } else if (particle.x > screenWidth - particleSize / 2) {
      fx = -boundaryForce;
    }

    if (particle.y < particleSize / 2) {
      fy = boundaryForce;
    } else if (particle.y > screenHeight - particleSize / 2) {
      fy = -boundaryForce;
    }

    return { fx, fy };
  };

  useEffect(() => {
    if (dragging !== null) {
      const handleMouseMove = (e) => {
        setParticles((particles) =>
          particles.map((p) =>
            p.id === dragging ? { ...p, x: e.clientX, y: e.clientY, vx: 0, vy: 0 } : p
          )
        );
      };

      const handleMouseUp = () => {
        setDragging(null);
      };

      window.addEventListener('mousemove', handleMouseMove);
      window.addEventListener('mouseup', handleMouseUp);

      return () => {
        window.removeEventListener('mousemove', handleMouseMove);
        window.removeEventListener('mouseup', handleMouseUp);
      };
    }
  }, [dragging]);

  useEffect(() => {
    const interval = setInterval(() => {
      setParticles((particles) =>
        particles.map((particle) => {
          const targetId = attractionMap[particle.id];
          const target = particles.find((p) => p.id === targetId);
          const attractionForces = calculateForce(particle, target);
          const boundaryForces = applyBoundaryForces(particle);
          const newVx = (particle.vx + attractionForces.fx + boundaryForces.fx) * damping;
          const newVy = (particle.vy + attractionForces.fy + boundaryForces.fy) * damping;
          return {
            ...particle,
            x: dragging === particle.id ? particle.x : particle.x + newVx,
            y: dragging === particle.id ? particle.y : particle.y + newVy,
            vx: newVx,
            vy: newVy,
            prevX: particle.x,
            prevY: particle.y,
          };
        })
      );
    }, 16);
    return () => clearInterval(interval);
  }, [particles, dragging]);

  useEffect(() => {
    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');

    const drawTrails = () => {
      particles.forEach((particle) => {
        ctx.strokeStyle = particle.color;
        ctx.lineWidth = 2;
        ctx.beginPath();
        ctx.moveTo(particle.prevX || particle.x, particle.prevY || particle.y);
        ctx.lineTo(particle.x, particle.y);
        ctx.stroke();
      });
    };

    const interval = setInterval(drawTrails, 16);
    return () => clearInterval(interval);
  }, [particles]);

  const springs = useSprings(
    particles.length,
    particles.map((particle) => ({
      left: particle.x,
      top: particle.y,
    }))
  );

  return (
    <div>
      <canvas
        ref={canvasRef}
        width={screenWidth}
        height={screenHeight}
        style={{ position: 'absolute', top: 0, left: 0, zIndex: -1 }}
      />
      {springs.map((spring, index) => {
        const particle = particles[index];
        return (
          <animated.div
            key={particle.id}
            onMouseDown={() => setDragging(particle.id)}
            style={{
              ...spring,
              position: 'absolute',
              width: particleSize,
              height: particleSize,
              borderRadius: '50%',
              cursor: 'pointer',
              backgroundColor: particle.color,
            }}
          />
        );
      })}
    </div>
  );
};

export default MagneticEffect;
