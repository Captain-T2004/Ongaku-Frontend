import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ACTIVITY_ICONS } from '../utils/constants';
import '../styles/ActivityCard.css';

const ActivityCard = ({ 
  activity, 
  language, 
  onExpand, 
  onClose, 
  isExpanded, 
  isHidden, 
  index 
}) => {
  const handleClick = () => {
    if (isExpanded) {
      onClose();
    } else {
      onExpand(activity.title);
    }
  };

  const displayTitle = language === 'ja' ? activity.title : activity.title_en || activity.title;
  const displayDescription = language === 'ja' ? activity.description : activity.description_en || activity.description;

  return (
    <motion.div
      className={`activity-card ${isExpanded ? 'expanded' : ''} ${isHidden ? 'hidden' : ''}`}
      onClick={handleClick}
      initial={{ opacity: 0, y: 20 }}
      animate={{ 
        opacity: 1, 
        y: 0
      }}
      transition={{ duration: 0.3, delay: index * 0.05 }}
    >
      <div className="activity-header">
        <div className="activity-icon">
          {ACTIVITY_ICONS[activity.type] || '🎵'}
        </div>
        <div className="activity-title-section">
          <div className="activity-title">{displayTitle}</div>
          {activity.venue && (
            <div className="activity-venue">📍 {activity.venue}</div>
          )}
        </div>
        {!isExpanded && (
          <div className="expand-icon">▼</div>
        )}
      </div>

      <AnimatePresence initial={false}>
        {isExpanded && (
          <motion.div
            className="activity-details"
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.25, ease: 'easeInOut' }}
          >
            <p className="activity-description">{displayDescription}</p>

            {activity.address && (
              <div className="activity-info">
                <span className="info-label">📍</span>
                <span>{activity.address}</span>
              </div>
            )}

            {activity.estimated_cost && (
              <div className="activity-info">
                <span className="info-label">💰</span>
                <span>{activity.estimated_cost}</span>
              </div>
            )}

            {activity.duration && (
              <div className="activity-info">
                <span className="info-label">⏱️</span>
                <span>{activity.duration}</span>
              </div>
            )}

            {activity.best_time && (
              <div className="activity-info">
                <span className="info-label">🕐</span>
                <span>{activity.best_time}</span>
              </div>
            )}

            {activity.weather_match && (
              <div className="activity-info weather-match">
                <span className="info-label">🌤️</span>
                <span>{activity.weather_match}</span>
              </div>
            )}

            {activity.link && (
              <a
                href={activity.link}
                target="_blank"
                rel="noopener noreferrer"
                className="activity-link"
                onClick={(e) => e.stopPropagation()}
              >
                {language === 'ja' ? '詳細を見る' : 'Learn More'} →
              </a>
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
};

export default ActivityCard;
