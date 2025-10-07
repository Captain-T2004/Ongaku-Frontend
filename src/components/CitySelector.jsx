import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import '../styles/CitySelector.css';

const JAPANESE_CITIES = [
  { id: 'tokyo', nameEn: 'Tokyo', nameJa: '東京' },
  { id: 'osaka', nameEn: 'Osaka', nameJa: '大阪' },
  { id: 'kyoto', nameEn: 'Kyoto', nameJa: '京都' },
  { id: 'sapporo', nameEn: 'Sapporo', nameJa: '札幌' },
  { id: 'fukuoka', nameEn: 'Fukuoka', nameJa: '福岡' },
  { id: 'nagoya', nameEn: 'Nagoya', nameJa: '名古屋' },
  { id: 'yokohama', nameEn: 'Yokohama', nameJa: '横浜' },
  { id: 'kobe', nameEn: 'Kobe', nameJa: '神戸' },
  { id: 'hiroshima', nameEn: 'Hiroshima', nameJa: '広島' },
  { id: 'sendai', nameEn: 'Sendai', nameJa: '仙台' }
];

const CitySelector = ({ selectedCity, onCityChange, language }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [customCity, setCustomCity] = useState('');
  const [showCustomInput, setShowCustomInput] = useState(false);

  const selectedCityData = JAPANESE_CITIES.find(city => city.nameEn === selectedCity);

  const handleCitySelect = (cityName) => {
    onCityChange(cityName);
    setIsOpen(false);
    setShowCustomInput(false);
    setCustomCity('');
  };

  const handleCustomSubmit = (e) => {
    e.preventDefault();
    if (customCity.trim()) {
      onCityChange(customCity.trim());
      setIsOpen(false);
      setShowCustomInput(false);
      setCustomCity('');
    }
  };

  return (
    <div className="city-selector">
      <button
        className="city-selector-toggle"
        onClick={() => setIsOpen(!isOpen)}
        type="button"
      >
        <span className="toggle-icon">📍</span>
        <div className="toggle-content">
          <span className="toggle-label">
            {language === 'ja' ? '目的地' : 'Destination'}
          </span>
          <span className="toggle-value">
            {selectedCityData 
              ? (language === 'ja' ? selectedCityData.nameJa : selectedCityData.nameEn)
              : selectedCity
            }
          </span>
        </div>
        <motion.span
          className="expand-arrow"
          animate={{ rotate: isOpen ? 180 : 0 }}
          transition={{ duration: 0.2 }}
        >
          ▼
        </motion.span>
      </button>

      <AnimatePresence>
        {isOpen && (
          <motion.div
            className="city-dropdown"
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.3 }}
          >
            <div className="city-list">
              {JAPANESE_CITIES.map((city) => (
                <motion.button
                  key={city.id}
                  className={`city-option ${selectedCity === city.nameEn ? 'selected' : ''}`}
                  onClick={() => handleCitySelect(city.nameEn)}
                  whileHover={{ x: 4 }}
                  whileTap={{ scale: 0.98 }}
                  type="button"
                >
                  <span className="city-name">
                    {language === 'ja' ? city.nameJa : city.nameEn}
                  </span>
                  {selectedCity === city.nameEn && (
                    <span className="check-icon">✓</span>
                  )}
                </motion.button>
              ))}
            </div>

            <div className="custom-city-section">
              {!showCustomInput ? (
                <button
                  className="custom-city-button"
                  onClick={() => setShowCustomInput(true)}
                  type="button"
                >
                  <span className="plus-icon">+</span>
                  {language === 'ja' ? '他の都市を入力' : 'Enter another city'}
                </button>
              ) : (
                <form onSubmit={handleCustomSubmit} className="custom-city-form">
                  <input
                    type="text"
                    value={customCity}
                    onChange={(e) => setCustomCity(e.target.value)}
                    placeholder={language === 'ja' ? '都市名を入力' : 'Enter city name'}
                    className="custom-city-input"
                    autoFocus
                  />
                  <div className="custom-city-actions">
                    <button
                      type="submit"
                      className="custom-submit"
                      disabled={!customCity.trim()}
                    >
                      {language === 'ja' ? '追加' : 'Add'}
                    </button>
                    <button
                      type="button"
                      className="custom-cancel"
                      onClick={() => {
                        setShowCustomInput(false);
                        setCustomCity('');
                      }}
                    >
                      {language === 'ja' ? 'キャンセル' : 'Cancel'}
                    </button>
                  </div>
                </form>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default CitySelector;
