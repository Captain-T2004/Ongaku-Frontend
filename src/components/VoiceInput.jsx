import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { VOICE_STATES, MESSAGES } from '../utils/constants';
import '../styles/VoiceInput.css';

const VoiceInput = ({ 
  voiceState, 
  onStartListening, 
  onStopListening, 
  isSupported,
  language,
  onTextSubmit,
  duration,
  onDurationChange
}) => {
  const [inputMode, setInputMode] = useState('voice');
  const [textInput, setTextInput] = useState('');
  const messages = MESSAGES[language];

  const getButtonState = () => {
    switch (voiceState) {
      case VOICE_STATES.LISTENING:
        return { text: messages.listening, className: 'listening' };
      case VOICE_STATES.PROCESSING:
        return { text: messages.processing, className: 'processing' };
      case VOICE_STATES.ERROR:
        return { text: messages.errorGeneric, className: 'error' };
      default:
        return { text: messages.voiceButton, className: 'idle' };
    }
  };

  const handleClick = () => {
    if (voiceState === VOICE_STATES.LISTENING) {
      onStopListening();
    } else if (voiceState === VOICE_STATES.IDLE) {
      onStartListening();
    }
  };

  const handleTextSubmit = (e) => {
    e.preventDefault();
    if (textInput.trim()) {
      onTextSubmit(textInput);
      setTextInput('');
    }
  };

  const handleIncrement = () => {
    if (duration < 7) {
      onDurationChange(duration + 1);
    }
  };

  const handleDecrement = () => {
    if (duration > 1) {
      onDurationChange(duration - 1);
    }
  };

  const { text, className } = getButtonState();

  return (
    <div className="voice-input-container">
      <div className="input-controls-bar">
        <div className="input-mode-toggle">
          <button
            className={`mode-button ${inputMode === 'voice' ? 'active' : ''}`}
            onClick={() => setInputMode('voice')}
            aria-label="Voice input mode"
            type="button"
          >
            🎤 {language === 'ja' ? '音声' : 'Voice'}
          </button>
          <button
            className={`mode-button ${inputMode === 'text' ? 'active' : ''}`}
            onClick={() => setInputMode('text')}
            aria-label="Text input mode"
            type="button"
          >
            ✏️ {language === 'ja' ? 'テキスト' : 'Text'}
          </button>
        </div>

        <div className="duration-control-inline">
          <span className="duration-label-inline">
            {language === 'ja' ? '期間' : 'Duration'}
          </span>
          <div className="duration-controls">
            <motion.button
              className="duration-btn"
              onClick={handleDecrement}
              disabled={duration <= 1}
              whileTap={{ scale: 0.9 }}
              aria-label="Decrease duration"
              type="button"
            >
              −
            </motion.button>
            <div className="duration-value">
              <span className="number">{duration}</span>
              <span className="unit">
                {language === 'ja' ? '日' : duration === 1 ? 'd' : 'd'}
              </span>
            </div>
            <motion.button
              className="duration-btn"
              onClick={handleIncrement}
              disabled={duration >= 7}
              whileTap={{ scale: 0.9 }}
              aria-label="Increase duration"
              type="button"
            >
              +
            </motion.button>
          </div>
        </div>
      </div>

      <AnimatePresence mode="wait">
        {inputMode === 'voice' ? (
          <motion.div
            key="voice"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.2 }}
            className="input-section"
          >
            {!isSupported ? (
              <div className="error-message">{messages.errorBrowser}</div>
            ) : (
              <>
                <motion.button
                  className={`voice-button ${className}`}
                  onClick={handleClick}
                  disabled={voiceState === VOICE_STATES.PROCESSING}
                  whileTap={{ scale: 0.98 }}
                  aria-label={text}
                  role="button"
                  aria-pressed={voiceState === VOICE_STATES.LISTENING}
                  type="button"
                >
                  <motion.div
                    className="voice-icon"
                    animate={{
                      scale: voiceState === VOICE_STATES.LISTENING ? [1, 1.1, 1] : 1
                    }}
                    transition={{
                      duration: 1,
                      repeat: voiceState === VOICE_STATES.LISTENING ? Infinity : 0
                    }}
                  >
                    {voiceState === VOICE_STATES.LISTENING ? '🎤' : '🎵'}
                  </motion.div>
                  <span className="voice-text">{text}</span>
                </motion.button>

                {voiceState === VOICE_STATES.LISTENING && (
                  <motion.div
                    className="listening-indicator"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                  >
                    <div className="sound-wave">
                      <span></span>
                      <span></span>
                      <span></span>
                    </div>
                  </motion.div>
                )}
              </>
            )}
          </motion.div>
        ) : (
          <motion.form
            key="text"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.2 }}
            className="text-input-section"
            onSubmit={handleTextSubmit}
          >
            <input
              type="text"
              value={textInput}
              onChange={(e) => setTextInput(e.target.value)}
              placeholder={language === 'ja' ? '音楽活動について質問してください...' : 'Ask about music activities...'}
              className="text-input"
              autoFocus
            />
            <motion.button
              type="submit"
              className="submit-button"
              disabled={!textInput.trim()}
              whileTap={{ scale: 0.98 }}
            >
              {language === 'ja' ? '送信' : 'Send'} →
            </motion.button>
          </motion.form>
        )}
      </AnimatePresence>
    </div>
  );
};

export default VoiceInput;
