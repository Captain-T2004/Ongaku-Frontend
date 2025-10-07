import React, { useState, useEffect, useRef, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import VoiceInput from './components/VoiceInput';
import ChatMessage from './components/ChatMessage';
import ActivityList from './components/ActivityList';
import ItineraryPlanner from './components/ItineraryPlanner';
import WeatherDisplay from './components/WeatherDisplay';
import LanguageToggle from './components/LanguageToggle';
import MusicPreferences from './components/MusicPreferences';
import CitySelector from './components/CitySelector';
import EnhancedLoadingSpinner from './components/EnhancedLoadingSpinner';
import ThemeToggle from './components/ThemeToggle';
import { useTheme } from './hooks/useTheme';
import { useSpeechRecognition } from './hooks/useSpeechRecognition';
import { useLanguage } from './hooks/useLanguage';
import { getQuickSuggestions, getItinerary, getWeather } from './services/api';
import { VOICE_STATES, MESSAGES } from './utils/constants';
import './styles/App.css';
import './styles/animations.css';

function App() {
  const { language, toggleLanguage, getSpeechLanguage } = useLanguage();
  const {
    transcript,
    voiceState,
    isSupported,
    startListening,
    stopListening,
    resetTranscript
  } = useSpeechRecognition(getSpeechLanguage());

  const [messages, setMessages] = useState([]);
  const [activities, setActivities] = useState([]);
  const [itinerary, setItinerary] = useState([]);
  const [queryInfo, setQueryInfo] = useState(null);
  const [weatherData, setWeatherData] = useState({});
  const [isWeatherLoading, setIsWeatherLoading] = useState(true);
  const [isLoadingActivities, setIsLoadingActivities] = useState(false);
  const [isLoadingItinerary, setIsLoadingItinerary] = useState(false);
  const [error, setError] = useState(null);
  const [selectedCity, setSelectedCity] = useState('Tokyo');
  const [expandedActivity, setExpandedActivity] = useState(null);
  const [bestWeatherCity, setBestWeatherCity] = useState(null);
  const [duration, setDuration] = useState(1);
  const [musicPreferences, setMusicPreferences] = useState([]);
  const { theme, toggleTheme } = useTheme();
  
  const messagesEndRef = useRef(null);
  const isQueryInProgress = useRef(false);
  const weatherFetched = useRef(false);

  const majorCities = ['Tokyo', 'Osaka', 'Kyoto', 'Sapporo', 'Fukuoka', 'Nagoya'];

  const scrollToBottom = useCallback(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, []);

  useEffect(() => {
    scrollToBottom();
  }, [messages, scrollToBottom]);

  const calculateBestWeather = useCallback((weatherMap) => {
    if (Object.keys(weatherMap).length === 0) return null;

    let bestCity = null;
    let bestScore = -Infinity;

    Object.entries(weatherMap).forEach(([cityName, weather]) => {
      if (!weather?.current) return;

      const temp = weather.current.temperature;
      const condition = weather.current.condition.toLowerCase();
      const precipitation = weather.current.precipitation || 0;
      const windspeed = weather.current.windspeed || 0;

      let score = 0;

      if (temp >= 18 && temp <= 25) {
        score += 50;
      } else if (temp >= 15 && temp < 18) {
        score += 30;
      } else if (temp > 25 && temp <= 28) {
        score += 30;
      } else {
        score -= Math.abs(temp - 21) * 2;
      }

      if (condition.includes('clear') || condition.includes('sunny')) {
        score += 40;
      } else if (condition.includes('partly cloudy') || condition.includes('mainly clear')) {
        score += 25;
      } else if (condition.includes('cloudy') || condition.includes('overcast')) {
        score += 10;
      } else if (condition.includes('rain') || condition.includes('drizzle')) {
        score -= 30;
      } else if (condition.includes('snow') || condition.includes('storm')) {
        score -= 50;
      }

      score -= precipitation * 10;

      if (windspeed > 30) {
        score -= (windspeed - 30) * 2;
      }

      if (score > bestScore) {
        bestScore = score;
        bestCity = cityName;
      }
    });

    return bestCity;
  }, []);

  useEffect(() => {
    if (weatherFetched.current) return;
    
    weatherFetched.current = true;

    const fetchAllWeather = async () => {
      setIsWeatherLoading(true);
      
      try {
        const weatherPromises = majorCities.map(async (city) => {
          try {
            const data = await getWeather(city);
            return { city, data };
          } catch (err) {
            console.error(`Error fetching weather for ${city}:`, err);
            return { city, data: null };
          }
        });

        const results = await Promise.all(weatherPromises);
        
        const weatherMap = {};
        results.forEach(({ city, data }) => {
          if (data) {
            weatherMap[city] = data;
          }
        });
        
        setWeatherData(weatherMap);
        const bestCity = calculateBestWeather(weatherMap);
        setBestWeatherCity(bestCity);
      } catch (err) {
        console.error('Error in weather fetch:', err);
      } finally {
        setIsWeatherLoading(false);
      }
    };

    fetchAllWeather();
  }, [calculateBestWeather, majorCities]);

  useEffect(() => {
    if (voiceState === VOICE_STATES.PROCESSING && transcript && !isQueryInProgress.current) {
      handleQuery(transcript);
      resetTranscript();
    }
  }, [voiceState, transcript]);

  const handleQuery = useCallback(async (query) => {
    if (!query.trim() || isQueryInProgress.current) return;

    isQueryInProgress.current = true;

    setMessages(prev => [...prev, { text: query, isUser: true }]);
    setIsLoadingActivities(true);
    setError(null);
    setActivities([]);
    setItinerary([]);
    setExpandedActivity(null);

    try {
      const quickResult = await getQuickSuggestions(
        query,
        selectedCity,
        musicPreferences,
        null
      );

      const activitiesCount = quickResult.suggestions?.length || 0;
      const responseMessage = language === 'ja' 
        ? `${activitiesCount}件のアクティビティが見つかりました`
        : `Found ${activitiesCount} activities`;
      
      setMessages(prev => [...prev, { text: responseMessage, isUser: false }]);
      setActivities((quickResult.suggestions || []).slice(0, 5));
      setQueryInfo(quickResult.query || null);
      setIsLoadingActivities(false);

      if (duration > 0) {
        setIsLoadingItinerary(true);
        
        try {
          const itineraryResult = await getItinerary(
            selectedCity,
            duration,
            musicPreferences,
            null,
            query,
            language
          );

          setItinerary(itineraryResult.itinerary || []);
        } catch (itineraryErr) {
          console.error('Itinerary error:', itineraryErr);
        } finally {
          setIsLoadingItinerary(false);
        }
      }

    } catch (err) {
      console.error('Error getting suggestions:', err);
      setError(MESSAGES[language].errorGeneric);
      setMessages(prev => [...prev, { 
        text: MESSAGES[language].errorGeneric, 
        isUser: false 
      }]);
      setIsLoadingActivities(false);
      setIsLoadingItinerary(false);
    } finally {
      isQueryInProgress.current = false;
    }
  }, [selectedCity, musicPreferences, duration, language]);

  const handleTextSubmit = useCallback((text) => {
    handleQuery(text);
  }, [handleQuery]);

  const handleActivityExpand = useCallback((activityTitle) => {
    setExpandedActivity(activityTitle);
  }, []);

  const handleActivityClose = useCallback(() => {
    setExpandedActivity(null);
  }, []);

  const handleDurationChange = useCallback((newDuration) => {
    setDuration(newDuration);
  }, []);

  const handleGenresChange = useCallback((genres) => {
    setMusicPreferences(genres);
  }, []);

  const handleCityChange = useCallback((city) => {
    setSelectedCity(city);
  }, []);

  return (
    <div className="app" role="main">
      <header className="app-header">
        <motion.div
          className="title-container"
          initial={{ opacity: 0, y: -15 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <h1 className="app-title">
            🎵 Ongaku
          </h1>
          <motion.p 
            className="app-tagline"
            whileHover={{ scale: 1.02 }}
          >
            <motion.span
              key={language}
              initial={{ opacity: 0, y: -5 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 5 }}
              transition={{ duration: 0.3 }}
            >
              {language === 'ja' ? '音楽を感じる' : 'Feel the Music'}
            </motion.span>
          </motion.p>
        </motion.div>
        <div className="header-controls">
          <LanguageToggle language={language} onToggle={toggleLanguage} />
          <ThemeToggle theme={theme} onToggle={toggleTheme} />
        </div>
      </header>

      <WeatherDisplay 
        weatherData={weatherData} 
        language={language} 
        isLoading={isWeatherLoading}
        majorCities={majorCities}
        bestWeatherCity={bestWeatherCity}
      />

      <div className="main-content">
        <VoiceInput
          voiceState={voiceState}
          onStartListening={startListening}
          onStopListening={stopListening}
          isSupported={isSupported}
          language={language}
          onTextSubmit={handleTextSubmit}
          duration={duration}
          onDurationChange={handleDurationChange}
        />

        <CitySelector
          selectedCity={selectedCity}
          onCityChange={handleCityChange}
          language={language}
        />

        <MusicPreferences
          selectedGenres={musicPreferences}
          onGenresChange={handleGenresChange}
          language={language}
        />

        <div className="conversation-container" role="log" aria-live="polite">
          <AnimatePresence>
            {messages.map((msg, index) => (
              <ChatMessage
                key={index}
                message={msg.text}
                isUser={msg.isUser}
                language={language}
              />
            ))}
          </AnimatePresence>

          {isLoadingActivities && (
            <EnhancedLoadingSpinner language={language} />
          )}

          <div ref={messagesEndRef} />
        </div>

        {activities.length > 0 && (
          <motion.div
            className="results-split-view"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.4 }}
          >
            <div className="split-left">
              <ActivityList
                activities={activities}
                language={language}
                expandedActivity={expandedActivity}
                onExpand={handleActivityExpand}
                onClose={handleActivityClose}
              />
            </div>
            <div className="split-right">
              {isLoadingItinerary ? (
                <div className="itinerary-loading">
                  <EnhancedLoadingSpinner language={language} />
                  <p className="loading-message">
                    {language === 'ja' 
                      ? '詳細な旅程を作成中...' 
                      : 'Creating detailed itinerary...'}
                  </p>
                </div>
              ) : itinerary.length > 0 ? (
                <ItineraryPlanner
                  itinerary={itinerary}
                  language={language}
                />
              ) : (
                <div className="itinerary-placeholder">
                  <div className="placeholder-icon">📅</div>
                  <p className="placeholder-text">
                    {language === 'ja'
                      ? '旅程を作成しています...'
                      : 'Your itinerary will appear here...'}
                  </p>
                </div>
              )}
            </div>
          </motion.div>
        )}

        {error && (
          <motion.div
            className="error-banner"
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            role="alert"
          >
            {error}
          </motion.div>
        )}
      </div>

      <footer className="app-footer">
        <p>
          {language === 'ja' 
            ? '音楽活動を探して楽しもう'
            : 'Discover and enjoy music activities'}
        </p>
      </footer>
    </div>
  );
}

export default App;
