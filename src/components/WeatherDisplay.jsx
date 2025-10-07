import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import WeatherSkeleton from './WeatherSkeleton';
import '../styles/WeatherDisplay.css';

const getWeatherEmoji = (condition) => {
  const lowerCondition = condition.toLowerCase();
  if (lowerCondition.includes('clear')) return '☀️';
  if (lowerCondition.includes('cloud')) return '☁️';
  if (lowerCondition.includes('rain')) return '🌧️';
  if (lowerCondition.includes('snow')) return '❄️';
  if (lowerCondition.includes('thunder')) return '⛈️';
  if (lowerCondition.includes('fog')) return '🌫️';
  return '☁️';
};

const CITY_NAMES = {
  ja: {
    'Tokyo': '東京',
    'Osaka': '大阪',
    'Kyoto': '京都',
    'Sapporo': '札幌',
    'Nagoya': '名古屋',
    'Fukuoka': '福岡'
  },
  en: {
    'Tokyo': 'Tokyo',
    'Osaka': 'Osaka',
    'Kyoto': 'Kyoto',
    'Sapporo': 'Sapporo',
    'Nagoya': 'Nagoya',
    'Fukuoka': 'Fukuoka'
  }
};

const getConditionJapanese = (condition) => {
  const conditionMap = {
    'Clear sky': '晴れ',
    'Mainly clear': '概ね晴れ',
    'Partly cloudy': '曇りがち',
    'Overcast': '曇り',
    'Fog': '霧',
    'Drizzle': '霧雨',
    'Rain': '雨',
    'Snow': '雪',
    'Rain showers': 'にわか雨',
    'Thunderstorm': '雷雨'
  };
  return conditionMap[condition] || '曇りがち';
};

const WeatherCard = ({ 
  cityName, 
  weather, 
  language, 
  onExpand, 
  onClose, 
  isExpanded, 
  index, 
  isHidden,
  isBestWeather 
}) => {
  if (!weather) return null;

  const displayName = language === 'ja' 
    ? (CITY_NAMES.ja[cityName] || cityName)
    : (CITY_NAMES.en[cityName] || cityName);

  const condition = weather.current?.condition || '';
  const conditionJa = getConditionJapanese(condition);

  const handleClick = (e) => {
    if (!isExpanded) {
      onExpand(cityName);
    }
  };

  const handleClose = (e) => {
    e.stopPropagation();
    onClose();
  };

  return (
    <motion.div
      className={`weather-card ${isExpanded ? 'expanded' : ''} ${isHidden ? 'hidden' : ''} ${isBestWeather ? 'best-weather' : ''}`}
      onClick={handleClick}
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, scale: 0.95 }}
      transition={{ 
        duration: 0.35,
        delay: isExpanded ? 0 : index * 0.08
      }}
      whileHover={!isExpanded ? { 
        y: -3,
        transition: { duration: 0.25 }
      } : {}}
      role="button"
      tabIndex={0}
      aria-expanded={isExpanded}
    >
      {isBestWeather && !isExpanded && (
        <motion.div
          className="best-weather-badge"
          initial={{ opacity: 0, scale: 0.8, y: -10 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          transition={{ delay: 0.5, type: "spring", stiffness: 200 }}
        >
          <span className="badge-icon">✨</span>
          <span className="badge-text">
            {language === 'ja' ? 'ベスト天気' : 'Best Outdoors'}
          </span>
        </motion.div>
      )}

      {isExpanded && (
        <motion.button
          className="close-button"
          onClick={handleClose}
          initial={{ opacity: 0, scale: 0 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.15 }}
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.9 }}
          aria-label="Close"
          type="button"
        >
          ✕
        </motion.button>
      )}

      <div className="weather-card-header">
        <div className="weather-card-title-section">
          <div className="weather-card-city">{displayName}</div>
          {!isExpanded && (
            <motion.div 
              className="weather-card-icon"
              whileHover={{ rotate: [0, -10, 10, -10, 0], transition: { duration: 0.4 } }}
            >
              {getWeatherEmoji(condition)}
            </motion.div>
          )}
        </div>
      </div>

      {isExpanded && (
        <div className="weather-expanded-header">
          <motion.div 
            className="weather-card-icon-large"
            initial={{ scale: 0, rotate: -180 }}
            animate={{ scale: 1, rotate: 0 }}
            transition={{ delay: 0.1, type: "spring" }}
          >
            {getWeatherEmoji(condition)}
          </motion.div>
        </div>
      )}

      <div className="weather-card-temp">
        {Math.round(weather.current?.temperature || 0)}°C
      </div>

      <div className="weather-card-condition">
        {language === 'ja' ? conditionJa : condition}
      </div>

      <AnimatePresence>
        {isExpanded && (
          <motion.div
            className="weather-card-details"
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.3 }}
          >
            <motion.div 
              className="weather-detail-row"
              initial={{ opacity: 0, x: -15 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.05 }}
            >
              <span className="detail-label">
                {language === 'ja' ? '風速' : 'Wind Speed'}
              </span>
              <span className="detail-value">
                {weather.current?.windspeed || 0} km/h
              </span>
            </motion.div>

            <motion.div 
              className="weather-detail-row"
              initial={{ opacity: 0, x: -15 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.1 }}
            >
              <span className="detail-label">
                {language === 'ja' ? '湿度' : 'Humidity'}
              </span>
              <span className="detail-value">
                {weather.hourly_forecast?.[0]?.humidity || 'N/A'}%
              </span>
            </motion.div>

            <motion.div 
              className="weather-detail-row"
              initial={{ opacity: 0, x: -15 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.15 }}
            >
              <span className="detail-label">
                {language === 'ja' ? '降水量' : 'Precipitation'}
              </span>
              <span className="detail-value">
                {weather.current?.precipitation || 0} mm
              </span>
            </motion.div>

            {weather.hourly_forecast && weather.hourly_forecast.length > 0 && (
              <motion.div 
                className="hourly-forecast"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2 }}
              >
                <div className="forecast-title">
                  {language === 'ja' ? '今後の予報' : 'Hourly Forecast'}
                </div>
                <div className="forecast-scroll">
                  {weather.hourly_forecast.slice(0, 8).map((hour, idx) => (
                    <motion.div 
                      key={idx} 
                      className="forecast-hour"
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: 0.25 + idx * 0.03 }}
                      whileHover={{ scale: 1.05 }}
                    >
                      <div className="forecast-time">
                        {new Date(hour.time).getHours()}:00
                      </div>
                      <div className="forecast-icon">
                        {getWeatherEmoji(hour.condition)}
                      </div>
                      <div className="forecast-temp">
                        {Math.round(hour.temperature)}°
                      </div>
                    </motion.div>
                  ))}
                </div>
              </motion.div>
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
};

const WeatherDisplay = ({ weatherData, language, isLoading, majorCities, bestWeatherCity }) => {
  const [expandedCity, setExpandedCity] = useState(null);

  const handleExpand = (cityName) => {
    setExpandedCity(cityName);
  };

  const handleClose = () => {
    setExpandedCity(null);
  };

  return (
    <section className="weather-section" aria-label="Major cities weather">
      <motion.h2 
        className="weather-section-title"
        initial={{ opacity: 0, y: -15 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4 }}
      >
        {language === 'ja' ? '主要都市の天気' : 'Major Cities Weather'}
      </motion.h2>
      
      <div className={`weather-cards-grid ${expandedCity ? 'has-expanded' : ''}`}>
        {isLoading ? (
          majorCities.map((_, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.2, delay: index * 0.05 }}
            >
              <WeatherSkeleton />
            </motion.div>
          ))
        ) : (
          Object.entries(weatherData).map(([cityName, weather], index) => (
            <WeatherCard
              key={cityName}
              cityName={cityName}
              weather={weather}
              language={language}
              onExpand={handleExpand}
              onClose={handleClose}
              isExpanded={expandedCity === cityName}
              isHidden={expandedCity && expandedCity !== cityName}
              index={index}
              isBestWeather={cityName === bestWeatherCity}
            />
          ))
        )}
      </div>
    </section>
  );
};

export default WeatherDisplay;
