import React from 'react';
import { useEffect, useState } from 'react';
import GifDisplay from '../../Utils/GifDisplay';
import './HomeStyles.css'
import Weather from './Weather.jsx'


const HomePage = ( {weather, exit} ) => {
    
    return (
        <div>
        {weather ? <Weather weather={weather} exit={exit}></Weather> : <h1>No Weather</h1>}
        {weather &&
            <div className='temp-text' style={{fontSize: 30}}>Air temperature in Oslo: {weather.air_temperature}</div>
            }
        </div>
    );
}

export default HomePage