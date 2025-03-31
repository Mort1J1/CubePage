// src/components/ProjectOne.js
import React from 'react';
import './Projects.css'
import Carousel from './Carousel';
import GifPlayer from './GifPlayer';

const images = [
  './Assets/CC/JumpingJello.png',
  './Assets/CC/BatshitBanana.png',
  './Assets/CC/CrookedCrab.png',
  './Assets/CC/MagicMicOriginal.png',
  './Assets/CC/PushyPawnOriginal.png',
  './Assets/CC/PerfectPencilLong.png',
  './Assets/CC/ChillChest.png',
  './Assets/CC/Mystique.png',
  './Assets/CC/RandomRobeBlueOriginal.png',
  './Assets/CC/PossessedPainting.png',
  './Assets/CC/KindKey.png',
  './Assets/CC/ChillChest.png',
]

const ProjectCrazyChess = () => (
  <div>
    <GifPlayer pausedSrc={'./Assets/CC/gif_pause.png'} src={'./Assets/CC/PerfectPencilAnimation.gif'}></GifPlayer>
    <h1 className='title'></h1>
    <div className='project-content'>
    <p className='text-content'>
    A chess-inspired game that I have developed. The game has a backend developed in Python where the game logic is calculated and communicated to the client using Flask.
     The frontend is built with React. The project is currently in a user testing phase and has not been officially launched yet. 
     The project has gained interest from other develoupers and I now have one more developer on my team. 
    </p>
    <Carousel images={images}></Carousel>
    {/* <p className='text-content'>
    Spillet kan testes på Crazychesski.com med testbruker som har brukernavn: 'test' og passord: 'test'.
    </p> */}
    </div>
  </div>
);

export default ProjectCrazyChess;

