import React from 'react';
import { motion } from 'framer-motion';
import '../styles/DurationControl.css';

const DurationControl = ({ duration, onDurationChange, language }) => {
  const handleIncrement = () => {
    if (duration < 7) {
      onDurationChange(duration + 1);
    }
  };

  const handleDecrement = () => {
    if (duration > 1) {
      onDurationChange(duration - 1);
    }
  };

  return (
    <div className="duration-control">
      <label className="duration-label">
        {language === 'ja' ? '期間' : 'Duration'}
      </label>
      <div className="duration-input-group">
        <motion.button
          className="duration-button"
          onClick={handleDecrement}
          disabled={duration <= 1}
          whileTap={{ scale: 0.95 }}
          whileHover={{ scale: 1.05 }}
          aria-label="Decrease duration"
        >
          −
        </motion.button>
        <div className="duration-display">
          <span className="duration-number">{duration}</span>
          <span className="duration-unit">
            {language === 'ja' ? '日' : duration === 1 ? 'Day' : 'Days'}
          </span>
        </div>
        <motion.button
          className="duration-button"
          onClick={handleIncrement}
          disabled={duration >= 7}
          whileTap={{ scale: 0.95 }}
          whileHover={{ scale: 1.05 }}
          aria-label="Increase duration"
        >
          +
        </motion.button>
      </div>
    </div>
  );
};

export default DurationControl;
