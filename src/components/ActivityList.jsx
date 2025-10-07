import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import ActivityCard from './ActivityCard';
import '../styles/ActivityList.css';

const ActivityList = ({ 
  activities, 
  language, 
  expandedActivity, 
  onExpand, 
  onClose 
}) => {
  return (
    <div className="activity-list">
      <h3 className="activity-list-title">
        {language === 'ja' ? '提案されたアクティビティ' : 'Suggested Activities'}
      </h3>
      <div className="activity-list-items">
        <AnimatePresence>
          {activities.map((activity, index) => (
            <ActivityCard
              key={index}
              activity={activity}
              language={language}
              onExpand={onExpand}
              onClose={onClose}
              isExpanded={expandedActivity === activity.title}
              isHidden={expandedActivity && expandedActivity !== activity.title}
              index={index}
            />
          ))}
        </AnimatePresence>
      </div>
    </div>
  );
};

export default ActivityList;
