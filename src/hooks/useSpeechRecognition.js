import { useState, useEffect, useRef, useCallback } from 'react';
import { VOICE_STATES } from '../utils/constants';

export const useSpeechRecognition = (language = 'ja-JP') => {
  const [transcript, setTranscript] = useState('');
  const [voiceState, setVoiceState] = useState(VOICE_STATES.IDLE);
  const [isSupported, setIsSupported] = useState(false);

  const recognitionRef = useRef(null);
  const retryTimeoutRef = useRef(null);
  const retryAttemptsRef = useRef(0);
  const isListeningRef = useRef(false);
  const hasReceivedSpeechRef = useRef(false);

  const MAX_RETRIES = 3;

  useEffect(() => {
    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;

    if (SpeechRecognition) {
      setIsSupported(true);
      recognitionRef.current = new SpeechRecognition();

      recognitionRef.current.continuous = true;
      recognitionRef.current.interimResults = true;
      recognitionRef.current.maxAlternatives = 1;
      recognitionRef.current.lang = language;

      recognitionRef.current.onstart = () => {
        console.log('Speech recognition started');
        isListeningRef.current = true;
        hasReceivedSpeechRef.current = false;
        retryAttemptsRef.current = 0;
        setVoiceState(VOICE_STATES.LISTENING);
      };

      recognitionRef.current.onresult = (event) => {
        console.log('Speech recognition result received');
        hasReceivedSpeechRef.current = true;
        let finalTranscript = '';
        let interimTranscript = '';

        for (let i = event.resultIndex; i < event.results.length; i++) {
          const transcriptPart = event.results[i][0].transcript;
          if (event.results[i].isFinal) {
            finalTranscript += transcriptPart;
          } else {
            interimTranscript += transcriptPart;
          }
        }

        if (finalTranscript) {
          console.log('Final transcript:', finalTranscript);
          setTranscript(finalTranscript);
          setVoiceState(VOICE_STATES.PROCESSING);
          isListeningRef.current = false;
          retryAttemptsRef.current = 0;
          
          if (recognitionRef.current) {
            try {
              recognitionRef.current.stop();
            } catch (err) {
              console.error('Error stopping after result:', err);
            }
          }
        }
      };

      recognitionRef.current.onerror = (event) => {
        console.error('Speech recognition error:', event.error, event);
        isListeningRef.current = false;

        switch (event.error) {
          case 'network':
            if (retryAttemptsRef.current < MAX_RETRIES) {
              console.log(`Network error — retrying (attempt ${retryAttemptsRef.current + 1})`);
              setVoiceState(VOICE_STATES.LISTENING);
              retryRecognition();
            } else {
              console.warn('Max network retry attempts reached');
              retryAttemptsRef.current = 0;
              setVoiceState(VOICE_STATES.ERROR);
              setTimeout(() => setVoiceState(VOICE_STATES.IDLE), 2000);
            }
            break;

          case 'no-speech':
            console.log('No speech detected');
            if (isListeningRef.current && retryAttemptsRef.current < MAX_RETRIES) {
              retryRecognition();
            } else {
              setVoiceState(VOICE_STATES.IDLE);
            }
            break;

          case 'aborted':
            console.log('Recognition aborted');
            setVoiceState(VOICE_STATES.IDLE);
            break;

          case 'audio-capture':
            console.error('Microphone error');
            setVoiceState(VOICE_STATES.ERROR);
            setTimeout(() => setVoiceState(VOICE_STATES.IDLE), 2000);
            break;

          case 'not-allowed':
            console.error('Microphone permission denied');
            setVoiceState(VOICE_STATES.ERROR);
            alert(language === 'ja-JP'
              ? 'マイクへのアクセスを許可してください'
              : 'Please allow microphone access');
            break;

          default:
            console.error('Unknown error:', event.error);
            setVoiceState(VOICE_STATES.ERROR);
            setTimeout(() => setVoiceState(VOICE_STATES.IDLE), 2000);
        }
      };

      recognitionRef.current.onend = () => {
        console.log('Speech recognition ended, isListening:', isListeningRef.current);
        
        if (isListeningRef.current && !hasReceivedSpeechRef.current) {
          console.log('Restarting recognition...');
          setTimeout(() => {
            if (isListeningRef.current && recognitionRef.current) {
              try {
                recognitionRef.current.start();
              } catch (err) {
                console.error('Failed to restart:', err);
                isListeningRef.current = false;
                setVoiceState(VOICE_STATES.IDLE);
              }
            }
          }, 300);
        } else {
          if (voiceState !== VOICE_STATES.PROCESSING) {
            setVoiceState(VOICE_STATES.IDLE);
          }
        }
      };
    } else {
      setIsSupported(false);
      console.warn('Speech recognition not supported');
    }

    return () => {
      if (recognitionRef.current) {
        isListeningRef.current = false;
        try {
          recognitionRef.current.stop();
        } catch (err) {
          console.error('Error stopping recognition:', err);
        }
      }
      if (retryTimeoutRef.current) clearTimeout(retryTimeoutRef.current);
    };
  }, [language]);

  useEffect(() => {
    if (recognitionRef.current) {
      recognitionRef.current.lang = language;
      console.log('Language updated to:', language);
    }
  }, [language]);

  const retryRecognition = useCallback(() => {
    if (retryTimeoutRef.current) clearTimeout(retryTimeoutRef.current);

    const attempt = retryAttemptsRef.current;
    const delay = 1000 * Math.pow(2, Math.min(attempt, 4));

    retryTimeoutRef.current = setTimeout(() => {
      if (recognitionRef.current && isListeningRef.current) {
        try {
          console.log(`Retrying speech recognition (attempt ${attempt + 1})...`);
          recognitionRef.current.start();
        } catch (err) {
          console.error('Retry failed:', err);
          isListeningRef.current = false;
          setVoiceState(VOICE_STATES.IDLE);
        }
      }
    }, delay);

    retryAttemptsRef.current = attempt + 1;
  }, []);

  const startListening = useCallback(() => {
    if (recognitionRef.current && voiceState === VOICE_STATES.IDLE) {
      try {
        setTranscript('');
        retryAttemptsRef.current = 0;
        hasReceivedSpeechRef.current = false;
        isListeningRef.current = true;
        recognitionRef.current.start();
        console.log('Starting speech recognition with language:', language);
      } catch (err) {
        console.error('Error starting speech recognition:', err);
        if (err.name === 'InvalidStateError') {
          try {
            recognitionRef.current.stop();
            setTimeout(() => {
              if (recognitionRef.current && isListeningRef.current) {
                recognitionRef.current.start();
              }
            }, 300);
          } catch (stopErr) {
            console.error('Failed to restart:', stopErr);
            isListeningRef.current = false;
            setVoiceState(VOICE_STATES.IDLE);
          }
        }
      }
    }
  }, [voiceState, language]);

  const stopListening = useCallback(() => {
    if (recognitionRef.current) {
      isListeningRef.current = false;
      hasReceivedSpeechRef.current = false;
      try {
        recognitionRef.current.stop();
        console.log('Stopping speech recognition');
      } catch (err) {
        console.error('Error stopping recognition:', err);
      }
    }
  }, []);

  const resetTranscript = useCallback(() => {
    setTranscript('');
    setVoiceState(VOICE_STATES.IDLE);
    isListeningRef.current = false;
    hasReceivedSpeechRef.current = false;
  }, []);

  return {
    transcript,
    voiceState,
    isSupported,
    startListening,
    stopListening,
    resetTranscript
  };
};