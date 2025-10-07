import React from 'react';
import { motion } from 'framer-motion';
import '../styles/LanguageToggle.css';

const LanguageToggle = ({ language, onToggle }) => {
  return (
    <button
      className="language-toggle"
      onClick={onToggle}
      aria-label={`Switch to ${language === 'ja' ? 'English' : 'Japanese'}`}
      role="switch"
      aria-checked={language === 'ja'}
      data-language={language}
      type="button"
    >
      <motion.div
        className="toggle-slider"
        animate={{
          x: language === 'en' ? 'calc(100% + var(--space-1))' : '0'
        }}
        transition={{ 
          type: 'spring', 
          stiffness: 500, 
          damping: 30,
          duration: 0.3
        }}
      />
      <span className={`toggle-option ${language === 'ja' ? 'active' : ''}`}>
        日本語
      </span>
      <span className={`toggle-option ${language === 'en' ? 'active' : ''}`}>
        EN
      </span>
    </button>
  );
};

export default LanguageToggle;
