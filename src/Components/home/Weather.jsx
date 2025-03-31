import React, { useState, useEffect } from 'react';
import './HomeStyles.css'; // Import the CSS file
import GifDisplay from '../../Utils/GifDisplay.jsx';
import { useSpring, animated } from '@react-spring/web';

const sol = './Assets/Sol.gif';
const sky = './Assets/Sky.gif';
const sky2 = './Assets/Sky2.gif';
const regn = './Assets/Rain.gif';


const Weather = ( {weather} ) => {
  
  let weather_widget_guide_default = {
    clouds: 0,
    sun_or_night: null,
    rain: 0,
  }

  const [sun, setSun] = useState(true)
  const [weatherGuide, setWeatherGuide] = useState(weather_widget_guide_default)

  useEffect(() => {
      // console.log(weather)
      sunC()
      calculateWeather(weather)
  }, []);

  //Calculate wether the sun is up or not in Oslo
  const sunC = () => {

    const SunCalc = require('suncalc');
  
    let times = SunCalc.getTimes(new Date(), 59.9139, 10.7522); // Latitude and Longitude of Oslo
    let sunrise = times.sunrise;
    let sunset = times.sunset;
    let currentTime = new Date();
  
    if (currentTime >= sunset || currentTime <= sunrise) {
        setSun(false)
    } else {
        setSun(true)
    }
  }

  // Animations
  const solAnimation = useSpring({
    from: { 
      opacity: 0,
      transform: 'translateY(-500%)' },
    to: { 
      opacity: 1,
      transform: 'translateY(0)',
    },
    config: { mass: 1, tension: 10, friction: 5 }
  });

  const skyAnimation = useSpring({
    from: { transform: 'translateX(500%)' },
    to: { transform: 'translateX(0)' },
    config: { mass: 1, tension: 10, friction: 5 }
  });

  const skyAnimation2 = useSpring({
    from: { transform: 'translateX(-500%)' },
    to: { transform: 'translateX(0)' },
    config: { mass: 1, tension: 10, friction: 5 }
  });

  const regnAnimation = useSpring({
    from: { opacity: 0 },
    to: { opacity: 1 },
    config: { duration: 5000 }
  });

  const calculateWeather = (weather) => {

    
    let weather_widget_guide = {
      clouds: null,
      sun_or_night: null,
      rain: null,
    }

    weather_widget_guide.sun_or_night = sun;
    
    const clouds = weather.cloud_area_fraction;
    const precipitation = weather.next_1_hours_details

    if (clouds <= 10)
      {
        //no cloud
        weather_widget_guide.clouds = 0
      }
    else if (clouds < 25)
      {
        //1 small cloud
        weather_widget_guide.clouds = 1
      }
    else if (clouds < 50)
      {
        //1 big cloud
        weather_widget_guide.clouds = 2
      }
    else if (clouds < 75)
      {
        //1 big cloud and 1 small
        weather_widget_guide.clouds = 3
      }
    else if (clouds > 75)
      {
        //1 big cloud and 1 small
        weather_widget_guide.clouds = 3
        //no sun or moon
        weather_widget_guide.sun_or_night = null
      }

    if (precipitation === 0)
      {
        //no rain
        weather_widget_guide.rain = 0
      }
    else if (precipitation < 4)  
      {
        //moderate rain
        weather_widget_guide.rain = 1
      }
    else if (precipitation > 4)  
      {
        //much rain
        weather_widget_guide.rain = 2
      }

      // console.log(weather_widget_guide)

      setWeatherGuide(weather_widget_guide)

  }

  return (
    <div className="weather_wrapper">
    
    { weatherGuide.sun_or_night && 
      
      <animated.div style={solAnimation} className='sol'>
        <GifDisplay gifUrl={sol} />
      </animated.div>
    }
      
      { weatherGuide.clouds >= 2 &&

      <animated.div style={skyAnimation2} className='sky2'>
        <GifDisplay gifUrl={sky2} />
      </animated.div>
      }


    { weatherGuide.clouds >= 1 &&
      
      <animated.div style={skyAnimation} className='sky'>
        <GifDisplay gifUrl={sky} />
      </animated.div>
    }

    { weatherGuide.rain >= 1 &&

      <animated.div style={regnAnimation} className='regn'>
        <GifDisplay gifUrl={regn} />
      </animated.div>
    }

    </div>
  );
};

export default Weather;
