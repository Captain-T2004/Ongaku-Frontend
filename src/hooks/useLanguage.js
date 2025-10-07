import { useState, useCallback } from 'react';
import { LANGUAGES } from '../utils/constants';

export const useLanguage = () => {
  const [language, setLanguage] = useState(LANGUAGES.JA);

  const toggleLanguage = useCallback(() => {
    setLanguage(prev => {
      const newLang = prev === LANGUAGES.JA ? LANGUAGES.EN : LANGUAGES.JA;
      return newLang;
    });
  }, []);

  const getSpeechLanguage = useCallback(() => {
    return language === LANGUAGES.JA ? 'ja-JP' : 'en-US';
  }, [language]);

  return {
    language,
    toggleLanguage,
    getSpeechLanguage
  };
};
