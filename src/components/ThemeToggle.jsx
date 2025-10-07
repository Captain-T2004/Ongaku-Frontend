import React from 'react';
import { motion } from 'framer-motion';
import '../styles/ThemeToggle.css';

const ThemeToggle = ({ theme, onToggle }) => {
  return (
    <button
      className="theme-toggle"
      onClick={onToggle}
      aria-label={`Switch to ${theme === 'light' ? 'dark' : 'light'} mode`}
      type="button"
    >
      <motion.div
        className="toggle-track"
        animate={{
          backgroundColor: theme === 'dark' ? '#334155' : '#e2e8f0'
        }}
        transition={{ duration: 0.3 }}
      >
        <motion.div
          className="toggle-thumb"
          animate={{
            x: theme === 'dark' ? 24 : 0
          }}
          transition={{ type: 'spring', stiffness: 500, damping: 30 }}
        >
          <span className="toggle-icon">
            {theme === 'dark' ? '🌙' : '☀️'}
          </span>
        </motion.div>
      </motion.div>
    </button>
  );
};

export default ThemeToggle;
