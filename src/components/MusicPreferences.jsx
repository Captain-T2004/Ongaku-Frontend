import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import '../styles/MusicPreferences.css';

const MUSIC_GENRES = [
  { id: 'jazz', label: 'Jazz', emoji: '🎷', labelJa: 'ジャズ' },
  { id: 'rock', label: 'Rock', emoji: '🎸', labelJa: 'ロック' },
  { id: 'pop', label: 'Pop', emoji: '🎤', labelJa: 'ポップ' },
  { id: 'classical', label: 'Classical', emoji: '🎻', labelJa: 'クラシック' },
  { id: 'electronic', label: 'Electronic', emoji: '🎧', labelJa: 'エレクトロニック' },
  { id: 'indie', label: 'Indie', emoji: '🎵', labelJa: 'インディー' },
  { id: 'hip-hop', label: 'Hip-Hop', emoji: '🎤', labelJa: 'ヒップホップ' },
  { id: 'folk', label: 'Folk', emoji: '🪕', labelJa: 'フォーク' }
];

const MusicPreferences = ({ selectedGenres, onGenresChange, language }) => {
  const [isExpanded, setIsExpanded] = useState(false);

  const toggleGenre = (genreId) => {
    if (selectedGenres.includes(genreId)) {
      onGenresChange(selectedGenres.filter(id => id !== genreId));
    } else {
      onGenresChange([...selectedGenres, genreId]);
    }
  };

  return (
    <div className="music-preferences">
      <button
        className="preferences-toggle"
        onClick={() => setIsExpanded(!isExpanded)}
        type="button"
      >
        <span className="toggle-icon">🎵</span>
        <span className="toggle-text">
          {language === 'ja' ? '音楽ジャンル' : 'Music Genres'}
        </span>
        {selectedGenres.length > 0 && (
          <span className="selected-count">{selectedGenres.length}</span>
        )}
        <motion.span
          className="expand-arrow"
          animate={{ rotate: isExpanded ? 180 : 0 }}
          transition={{ duration: 0.2 }}
        >
          ▼
        </motion.span>
      </button>

      <AnimatePresence>
        {isExpanded && (
          <motion.div
            className="genres-grid"
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.3 }}
          >
            {MUSIC_GENRES.map((genre) => (
              <motion.button
                key={genre.id}
                className={`genre-chip ${selectedGenres.includes(genre.id) ? 'selected' : ''}`}
                onClick={() => toggleGenre(genre.id)}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                type="button"
              >
                <span className="genre-emoji">{genre.emoji}</span>
                <span className="genre-label">
                  {language === 'ja' ? genre.labelJa : genre.label}
                </span>
              </motion.button>
            ))}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default MusicPreferences;
