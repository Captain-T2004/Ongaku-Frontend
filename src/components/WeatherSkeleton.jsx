import React from 'react';
import '../styles/WeatherDisplay.css';

const WeatherSkeleton = () => {
  return (
    <div className="weather-card skeleton">
      <div className="weather-card-header">
        <div className="skeleton-text skeleton-city"></div>
        <div className="skeleton-icon"></div>
      </div>
      <div className="skeleton-text skeleton-temp"></div>
      <div className="skeleton-text skeleton-condition"></div>
    </div>
  );
};

export default WeatherSkeleton;
