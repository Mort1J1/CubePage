import React, { useState, useRef, useEffect, useContext } from 'react';
import Project from './Project';
import './Projects.css';
import { useSpring, animated } from 'react-spring';
import ProjectCrazyChess from './ProjectCrazyChess';
import ProjectAquaLife from './ProjectAquaLife';
import ProjectFunchase from './ProjectFunchase';
import { MenuProvider, MenuContext } from '../../Utils/MenuProvider.jsx';


const projects = [
  {
    name: 'CrazyChess',
    content: <ProjectCrazyChess />,
  },
  {
    name: 'AquaLife',
    content: <ProjectAquaLife />
  },
  {
    name: 'Funchase',
    content:  <ProjectFunchase />
  },
];

const ProjectsList = () => {

  const { 
    menuCubeOn,
    setMenuCubeOn,
    menuArrowsOn,
    setMenuArrowsOn,
    menuButtonOn,
    setMenuButtonOn, } = useContext(MenuContext);

  const [activeProject, setActiveProject] = useState(null);
  const containerRef = useRef(null);
  const projectRefs = useRef([]);

  const [springProps, springApi] = useSpring(() => ({
    y: 0,
    config: { mass: 2, tension: 500, friction: 50 },
  }));

  useEffect(() => {
    // Initialize projectRefs with the correct number of refs
    projectRefs.current = projects.map((_, i) => projectRefs.current[i] || React.createRef());
    console.log(projectRefs)
  }, []);

  useEffect(() => {
    if (activeProject){
      setMenuButtonOn(false)
    }
    else{
      setMenuButtonOn(true)
    }
  }, [activeProject]);

  const handleProjectClick = async (projectName) => {
    const projectIndex = projects.findIndex((project) => project.name === projectName);

    if (projectIndex !== -1) {
      const offset = calculateOffset(projectIndex);

      console.log('HPC', offset)

      // const promise = await offset

      // console.log(promise)

      if (activeProject === projectName) {
        springApi.start({ y: 0 }); // Reset to initial position when toggled off
        setActiveProject(null);
      } else {
        const value = await offset
        springApi.start({ y: -value }); // Move to the clicked project's position
        setActiveProject(projectName);
      }
    }
  };

  const calculateOffset = (index) => {
    return new Promise((resolve) => {
      setTimeout(() => {
        console.log('Calculating offset...');
        if (!containerRef.current || !projectRefs.current[index]) {
          console.log('Invalid refs:', containerRef.current, projectRefs.current[index]);
          return resolve(0);
        }
        const temporaryStyle = { ...containerRef.current.style };
        containerRef.current.style.alignContent = 'flex-start'; // Adjust as needed

        const containerRect = containerRef.current.getBoundingClientRect();
        const projectRect = projectRefs.current[index].getBoundingClientRect();
        
        containerRef.current.style = temporaryStyle
        
        const offset = projectRect.top - containerRect.top;
        console.log(`Offset for project ${index}: ${offset}px`);
  
        resolve(offset);
      }, 0); // Adjust the delay if needed
    });
  };

  return (
    <div className="projects-list" ref={containerRef}>
      {projects.map((project, index) => (
        <animated.div
          key={index}
          ref={(el) => (projectRefs.current[index] = el)}
          className="project-container"
          style={{
            transform: springProps.y.to((y) => `translateY(${y}px)`),
            position: 'relative',
            zIndex: activeProject === project.name ? 1 : 0,
            opacity: activeProject && activeProject !== project.name ? 0 : 1,
            pointerEvents: activeProject && activeProject !== project.name ? 'none' : 'auto',
          }}
        >
          <Project
            onClick={() => handleProjectClick(project.name)}
            project={project}
            isActive={activeProject === project.name}
            children={project.content}
          />
        </animated.div>
      ))}
    </div>
  );
};

export default ProjectsList;
