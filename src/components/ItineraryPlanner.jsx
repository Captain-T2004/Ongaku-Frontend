import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import '../styles/ItineraryPlanner.css';

const getWeatherEmoji = (condition) => {
  const lowerCondition = condition?.toLowerCase() || '';
  if (lowerCondition.includes('clear')) return '☀️';
  if (lowerCondition.includes('cloud')) return '☁️';
  if (lowerCondition.includes('rain')) return '🌧️';
  if (lowerCondition.includes('snow')) return '❄️';
  return '🌤️';
};

const formatDate = (dateStr, language) => {
  const date = new Date(dateStr);
  const options = { month: 'short', day: 'numeric', weekday: 'short' };
  return date.toLocaleDateString(language === 'ja' ? 'ja-JP' : 'en-US', options);
};

const ItineraryPlanner = ({ itinerary, language }) => {
  const [expandedActivity, setExpandedActivity] = useState(null);

  if (!itinerary || itinerary.length === 0) return null;

  const toggleActivity = (dayIndex, activityIndex) => {
    const key = `${dayIndex}-${activityIndex}`;
    setExpandedActivity(expandedActivity === key ? null : key);
  };

  return (
    <motion.div
      className="itinerary-planner"
      initial={{ opacity: 0, x: 20 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ duration: 0.4, delay: 0.2 }}
    >
      <div className="itinerary-header">
        <h3 className="itinerary-title">
          {language === 'ja' ? '旅程プラン' : 'Your Itinerary'}
        </h3>
        <div className="itinerary-duration">
          <span className="duration-badge">
            {itinerary.length} {language === 'ja' ? '日間' : itinerary.length === 1 ? 'Day' : 'Days'}
          </span>
        </div>
      </div>

      <div className="itinerary-timeline">
        {itinerary.map((day, dayIndex) => (
          <motion.div
            key={dayIndex}
            className="itinerary-day"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3, delay: dayIndex * 0.1 }}
          >
            <div className="day-header">
              <div className="day-info">
                <div className="day-number">
                  {language === 'ja' ? `${day.day}日目` : `Day ${day.day}`}
                </div>
                {day.date && (
                  <div className="day-date">
                    {formatDate(day.date, language)} • {language === 'ja' ? day.day_name : day.day_name_en}
                  </div>
                )}
              </div>
              {day.weather_overview && (
                <div className="day-weather">
                  <span className="weather-icon">
                    {getWeatherEmoji(day.weather_overview.condition)}
                  </span>
                  <span className="weather-temp">
                    {day.weather_overview.temp_range}
                  </span>
                </div>
              )}
            </div>

            {day.weather_overview && (day.weather_overview.advice || day.weather_overview.advice_ja) && (
              <div className="weather-advice">
                <span className="advice-icon">💡</span>
                <span className="advice-text">
                  {language === 'ja' ? day.weather_overview.advice_ja : day.weather_overview.advice}
                </span>
              </div>
            )}

            <div className="day-activities">
              {day.schedule && day.schedule.map((activity, actIndex) => {
                const isExpanded = expandedActivity === `${dayIndex}-${actIndex}`;
                
                return (
                  <div
                    key={actIndex}
                    className={`itinerary-activity ${isExpanded ? 'expanded' : ''}`}
                    onClick={() => toggleActivity(dayIndex, actIndex)}
                  >
                    <div className="activity-time">
                      <span className="time-icon">🕐</span>
                      <span className="time-text">{activity.time_slot || `${activity.start_time} - ${activity.end_time}`}</span>
                    </div>
                    <div className="activity-content">
                      <div className="activity-name">
                        {language === 'ja' ? activity.activity : activity.activity_en}
                      </div>
                      {activity.location && (
                        <div className="activity-venue">
                          📍 {language === 'ja' ? activity.location : activity.location_en}
                        </div>
                      )}
                      {!isExpanded && activity.weather_at_time && (
                        <div className="activity-weather-preview">
                          {getWeatherEmoji(activity.weather_at_time.condition)} {Math.round(activity.weather_at_time.temperature)}°C
                        </div>
                      )}
                    </div>
                    <motion.div
                      className="expand-indicator"
                      animate={{ rotate: isExpanded ? 180 : 0 }}
                      transition={{ duration: 0.2 }}
                    >
                      ▼
                    </motion.div>

                    <AnimatePresence initial={false}>
                      {isExpanded && (
                        <motion.div
                          className="activity-details-expanded"
                          initial={{ height: 0, opacity: 0 }}
                          animate={{ height: 'auto', opacity: 1 }}
                          exit={{ height: 0, opacity: 0 }}
                          transition={{ duration: 0.25, ease: 'easeInOut' }}
                        >
                          <p className="activity-description">
                            {language === 'ja' ? activity.description : activity.description_en}
                          </p>

                          {activity.address && (
                            <div className="detail-row">
                              <span className="detail-label">📍 {language === 'ja' ? '住所' : 'Address'}</span>
                              <span className="detail-value">{activity.address}</span>
                            </div>
                          )}

                          {activity.weather_at_time && (
                            <div className="detail-row">
                              <span className="detail-label">🌤️ {language === 'ja' ? '天気' : 'Weather'}</span>
                              <span className="detail-value">
                                {getWeatherEmoji(activity.weather_at_time.condition)} {language === 'ja' ? activity.weather_at_time.condition_ja : activity.weather_at_time.condition} • {Math.round(activity.weather_at_time.temperature)}°C
                              </span>
                            </div>
                          )}

                          {activity.cost && (
                            <div className="detail-row">
                              <span className="detail-label">💰 {language === 'ja' ? '費用' : 'Cost'}</span>
                              <span className="detail-value">{activity.cost}</span>
                            </div>
                          )}

                          {activity.estimated_duration && (
                            <div className="detail-row">
                              <span className="detail-label">⏱️ {language === 'ja' ? '所要時間' : 'Duration'}</span>
                              <span className="detail-value">{language === 'ja' ? activity.estimated_duration : activity.estimated_duration_en}</span>
                            </div>
                          )}

                          {(activity.tips || activity.tips_en) && (
                            <div className="tips-section">
                              <span className="tips-icon">💡</span>
                              <span className="tips-text">
                                {language === 'ja' ? activity.tips : activity.tips_en}
                              </span>
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
                              {language === 'ja' ? '詳細を見る' : 'View Details'} →
                            </a>
                          )}
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </div>
                );
              })}
            </div>

            {day.daily_summary && (
              <div className="day-summary">
                <p className="summary-text">
                  {language === 'ja' ? day.daily_summary.ja : day.daily_summary.en}
                </p>
                {day.total_cost_estimate && (
                  <div className="summary-cost">
                    💰 {language === 'ja' ? '予算' : 'Budget'}: {day.total_cost_estimate}
                  </div>
                )}
              </div>
            )}
          </motion.div>
        ))}
      </div>
    </motion.div>
  );
};

export default ItineraryPlanner;
