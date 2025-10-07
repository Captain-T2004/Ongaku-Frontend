import React from 'react';
import { motion } from 'framer-motion';
import '../styles/QuickStats.css';

const QuickStats = ({ language }) => {
  const stats = [
    {
      icon: '🎸',
      value: '500+',
      label: language === 'ja' ? 'ライブ会場' : 'Live Venues',
      labelJa: 'ライブ会場'
    },
    {
      icon: '🎭',
      value: '100+',
      label: language === 'ja' ? '音楽祭' : 'Music Festivals',
      labelJa: '音楽祭'
    },
    {
      icon: '🎼',
      value: '1000+',
      label: language === 'ja' ? 'アクティビティ' : 'Activities',
      labelJa: 'アクティビティ'
    }
  ];

  return (
    <div className="quick-stats">
      {stats.map((stat, index) => (
        <motion.div
          key={index}
          className="stat-card"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: index * 0.1, duration: 0.4 }}
          whileHover={{ y: -3 }}
        >
          <div className="stat-icon">{stat.icon}</div>
          <div className="stat-value">{stat.value}</div>
          <div className="stat-label">{stat.label}</div>
        </motion.div>
      ))}
    </div>
  );
};

export default QuickStats;
