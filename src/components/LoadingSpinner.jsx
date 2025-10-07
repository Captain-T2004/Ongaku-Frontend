import React from 'react';
import '../styles/LoadingSpinner.css';

const LoadingSpinner = ({ message }) => {
  return (
    <div className="loading-container">
      <div className="spinner">🎵</div>
      {message && <div className="loading-message">{message}</div>}
    </div>
  );
};

export default LoadingSpinner;
