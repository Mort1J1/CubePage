// src/Project.js
import React, { useRef, useEffect, useState } from 'react';
import { useSpring, animated } from 'react-spring';
import './Projects.css';

const Project = ({ project, isActive, onClick, children }) => {
  const projectRef = useRef(null);
  const [hovered, setHovered] = useState(false);

  //animation spring
  const { scale, y } = useSpring({
    scale: hovered ? 1 : 1,
    y: hovered ? -10 : 0,
    config: { tension: 300, friction: 10 },
  });

  const springProps = useSpring({
    opacity: isActive ? 1 : 0,
    from: { opacity: 0 },
  });

  const handleProjectClick = () => {
    console.log('project click');
    onClick(project.name);
  };

  return (
    <div 
      ref={projectRef}
      className={`project-title ${isActive ? 'active' : ''}`}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      style={{ transform: `scale(${scale}) translateY(${y}px)`}}
      
      >
        
      <div onClick={handleProjectClick} className={!isActive ? 'project-name' : 'project-name-active'} >
        {project.name}
      </div>
      {isActive &&
        <animated.div style={springProps} className="project-description-container">
          {/* <p className="project-description">{project.description}</p> */}
          {children || <p>Default content if children are not available</p>}
        </animated.div>
      }
    </div>
  );
};

export default Project;
