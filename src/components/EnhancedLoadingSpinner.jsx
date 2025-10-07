import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import '../styles/EnhancedLoadingSpinner.css';

const LOADING_STAGES = [
  { id: 1, textEn: 'Analyzing your preferences...', textJa: 'あなたの好みを分析中...', icon: '🎵', duration: 1500 },
  { id: 2, textEn: 'Checking weather conditions...', textJa: '天気状況を確認中...', icon: '🌤️', duration: 1500 },
  { id: 3, textEn: 'Finding best activities...', textJa: '最適なアクティビティを検索中...', icon: '🎭', duration: 2000 },
  { id: 4, textEn: 'Almost ready...', textJa: 'もうすぐ完了...', icon: '✨', duration: 1000 }
];

const EnhancedLoadingSpinner = ({ language }) => {
  const [currentStage, setCurrentStage] = useState(0);
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    const totalDuration = LOADING_STAGES.reduce((acc, stage) => acc + stage.duration, 0);
    let elapsed = 0;

    const progressInterval = setInterval(() => {
      elapsed += 50;
      const progressPercent = Math.min((elapsed / totalDuration) * 100, 100);
      setProgress(progressPercent);
    }, 50);

    const stageTimers = [];
    let accumulatedTime = 0;

    LOADING_STAGES.forEach((stage, index) => {
      const timer = setTimeout(() => {
        setCurrentStage(index);
      }, accumulatedTime);
      stageTimers.push(timer);
      accumulatedTime += stage.duration;
    });

    return () => {
      clearInterval(progressInterval);
      stageTimers.forEach(timer => clearTimeout(timer));
    };
  }, []);

  const stage = LOADING_STAGES[currentStage];

  return (
    <div className="enhanced-loading-container">
      <div className="loading-progress-bar">
        <motion.div
          className="progress-fill"
          initial={{ width: '0%' }}
          animate={{ width: `${progress}%` }}
          transition={{ duration: 0.3 }}
        />
      </div>

      <AnimatePresence mode="wait">
        <motion.div
          key={stage.id}
          className="loading-stage"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -20 }}
          transition={{ duration: 0.4 }}
        >
          <motion.div
            className="stage-icon"
            animate={{
              scale: [1, 1.2, 1],
              rotate: [0, 10, -10, 0]
            }}
            transition={{
              duration: 1.5,
              repeat: Infinity,
              ease: "easeInOut"
            }}
          >
            {stage.icon}
          </motion.div>
          <div className="stage-text">
            {language === 'ja' ? stage.textJa : stage.textEn}
          </div>
        </motion.div>
      </AnimatePresence>

      <div className="loading-dots">
        {[0, 1, 2].map((i) => (
          <motion.div
            key={i}
            className="dot"
            animate={{
              scale: [1, 1.5, 1],
              opacity: [0.3, 1, 0.3]
            }}
            transition={{
              duration: 1.5,
              repeat: Infinity,
              delay: i * 0.2
            }}
          />
        ))}
      </div>
    </div>
  );
};

export default EnhancedLoadingSpinner;
