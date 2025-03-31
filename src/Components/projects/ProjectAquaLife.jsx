// src/components/ProjectOne.js
import React from 'react';
import './Projects.css'
import Carousel from './Carousel';
import GifPlayer from './GifPlayer';

const images = [
  './Assets/AquaLife/AquaLifeLogo.webp',
  './Assets/AquaLife/AquaLifeLogo.webp',
  './Assets/AquaLife/AquaLifeLogo.webp',
  './Assets/AquaLife/AquaLifeLogo.webp',
  './Assets/AquaLife/AquaLifeLogo.webp',
  './Assets/AquaLife/AquaLifeLogo.webp',
  './Assets/AquaLife/AquaLifeLogo.webp',
  './Assets/AquaLife/AquaLifeLogo.webp',
  './Assets/AquaLife/AquaLifeLogo.webp',
  './Assets/AquaLife/AquaLifeLogo.webp',
  './Assets/AquaLife/AquaLifeLogo.webp',
]

const ProjectAquaLife = () => (
  <div>
    <h1 className='title'>AquaLife</h1>
    <div className='project-content'>
    <p className='text-content'>
        AquaLife-rd.no was the first website I created by my self. The project was mostly focused around design and made with the tool Wix. 
        The goal of the project was to create a professional website for the company to represent them.
    </p>
    <Carousel images={images}></Carousel>
    </div>
  </div>
);

export default ProjectAquaLife;

