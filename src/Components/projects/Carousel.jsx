import React from 'react';
import './Carousel.css';

const Carousel = ({ images }) => {
  return (
    <div className="carousel-container">
      <div className="carousel-track">
        {images.map((src, index) => (
          <div className="carousel-item" key={index}>
            <img src={src} alt={`Slide ${index}`} />
          </div>
        ))}
        {images.map((src, index) => (
          <div className="carousel-item" key={`${index}-duplicate`}>
            <img src={src} alt={`Slide ${index}`} />
          </div>
        ))}
      </div>
    </div>
  );
};

export default Carousel;
